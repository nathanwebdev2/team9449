# Spec 0012 — Discoverability Foundation

**Status:** Ready for implementation
**Phase:** A — Credibility
**Model:** Sonnet (not Opus — well-specified, standard Next.js infrastructure)
**Branch:** `feat/0012-discoverability-foundation`
**Estimated:** One session
**Depends on:** Spec 0011 (content integrity — must ship first; this spec surfaces content, and 0011 is what made the content safe to surface)

---

## 1. Goal

Right now, sharing any page of this site — in a Discord, a sponsor email, a Chief Delphi post — produces a blank grey rectangle with no title. There is no `sitemap.ts`, no `robots.ts`, no per-route social preview image, no structured data, and no custom 404/error page. For a team whose strongest asset is a *communications* award, this is the single most conspicuous gap in the site.

This spec makes the site describe itself correctly to search engines, social platforms, and visitors who land on a broken URL. It adds no visible page content and changes no visual design.

**User story:** A sponsor pastes a link to `/robots/2026-honeycomb` into Slack. It unfurls with the robot's name, a real image, and a description — not a blank box. A visitor mistypes a URL and lands on a page that looks like the rest of the site and offers a way back, not a stock Next.js error screen.

---

## 2. Read before starting

1. `CLAUDE.md`.
2. `docs/specs/0011-content-integrity.md` and its accepted report — particularly the finding that `heroImage` in MDX front matter does **not** control what image renders; `public/robots/<slug>/` filenames do. OG image generation for robot pages must read images the same way `getRobotImages()` does, not from front matter.
3. `docs/design/tokens.md` — OG images must use real design tokens (Signal Yellow, dark background, IBM Plex/Archivo), not defaults.
4. Current `src/app/layout.tsx` — Spec 0011 removed a `[TK]` placeholder meta description from here. This spec fills that gap for real (see §3.5).
5. `docs/STATE.md` rev 8 — brand name and domain status.

---

## 3. Scope — six work items

### 3.1 — Site URL as a single source of truth

**Problem, stated up front because it shapes everything else in this spec:** the site is currently served from `https://team9449.vercel.app`. Nathan expects to purchase `team9449.ca` within about a week. Every canonical URL, sitemap entry, OG image URL, and JSON-LD `url` field this spec adds will be wrong the day the domain switches — unless the base URL is defined in exactly one place.

**Do:**
- Add an environment variable, `NEXT_PUBLIC_SITE_URL`, defaulting to `https://team9449.vercel.app` if unset.
- Set `metadataBase` in the root layout from this variable, per Next's `Metadata` API. Every relative URL used in metadata (OG images, canonicals) resolves against it automatically.
- Every other place in this spec that needs the site's own URL (sitemap, JSON-LD `url` fields) reads from this same variable — never hardcode `team9449.vercel.app` a second time anywhere.
- Document the variable in `docs/runbook.md` (create the file if it doesn't exist yet, per the repo structure in the operations plan) with one line: what it is, and "update this and redeploy when `team9449.ca` goes live — nothing else needs to change."

**Acceptance:**
- [ ] `grep -r "team9449.vercel.app"` outside `.env` files, `docs/`, and this spec returns nothing — the literal string exists in exactly one place in code.
- [ ] Switching the env var and rebuilding changes every canonical URL, sitemap URL, and OG image URL site-wide with no other edit.

---

### 3.2 — `robots.ts` and `sitemap.ts`

**Do — `src/app/robots.ts`:**
- Allow all crawlers on all public routes.
- Disallow nothing currently exists to disallow (no `/thehive` or `/admin` routes are live yet) — but write the rule so that when Hive-platform routes exist in a later phase, adding a disallow entry is a one-line change, not a restructure. Reference `sitemap.ts`'s URL via the env var from §3.1.

**Do — `src/app/sitemap.ts`:**
- Dynamically generate entries for every real, indexable public route:
  - `/`
  - `/robots` and `/robots/[slug]` for every robot that exists in content (drive this from the same content loader `getRobots()` uses — do not hand-maintain a list that will drift)
  - `/team`, `/team/join`
  - `/impact`, `/sponsors`, `/resources` — these are `ComingSoon` today. **Decision: include them.** They are real, permanent URLs that will hold real content soon; excluding them now and re-adding them later serves no purpose and risks being forgotten. Do not give them a false `lastModified` — use the actual page's last-known content date if available, otherwise the deploy date.
- Do **not** include `/motion-test` (removed in 0011) or any future internal/Hive route.
- Each entry gets a reasonable `changeFrequency` and `priority` (homepage and `/robots` highest; individual robot pages and static pages lower) — use judgment, this doesn't need to be precise, just not uniform.

**Acceptance:**
- [ ] `/sitemap.xml` and `/robots.txt` both resolve on the built site.
- [ ] Adding a new robot MDX file adds it to the sitemap automatically on next build, with no manual edit.
- [ ] Neither file contains a hardcoded domain string (see §3.1).

---

### 3.3 — Per-route Open Graph images

**Use Next's built-in `opengraph-image` file convention (`ImageResponse` from `next/og`) — no new dependency.** This was explicitly the recommendation in the review this spec is based on.

**Do:**
- Add `opengraph-image.tsx` at these levels, using the App Router convention (each generates automatically for its route and all of its children unless overridden):
  - Root (`src/app/opengraph-image.tsx`) — the site-wide default. Team name (Yellowjackets), team number (9449), and the Signal Yellow hex-aperture motif from the design system. This is what `/team`, `/impact`, `/sponsors`, `/resources` will inherit unless given their own.
  - `src/app/(public)/robots/opengraph-image.tsx` — a robots-archive-specific version (e.g. "Robot Archive — Yellowjackets 9449").
  - `src/app/(public)/robots/[slug]/opengraph-image.tsx` — **per-robot**, dynamic. Pulls the robot's name, season/year, and hero image the same way the page itself does — via `getRobotImages(slug)`, reading `public/robots/<slug>/`, **not** via the front-matter `heroImage` field (see §2, item 2). If a robot has no photos yet (e.g. a newly-added offseason robot with content but no images), fall back to the root default rather than erroring or rendering a broken image reference.
- Visual design for all OG images: dark background (`tokens.md` background colour), IBM Plex/Archivo per the type system, Signal Yellow used sparingly as an accent (per the existing "sparingly" rule — do not make the whole canvas yellow). Treat the hexagon as an aperture/frame element consistent with the hero, not decorative background texture, per the design direction documented in project memory and `tokens.md`.
- Standard OG dimensions (1200×630).
- Verify these actually resolve at `/opengraph-image` and `/robots/2026-honeycomb/opengraph-image` (or whatever path Next assigns) in a built app, not just that the files exist.

**Acceptance:**
- [ ] Root, `/robots`, and every individual robot page produce a distinct, correctly-sized OG image.
- [ ] A robot with no photos does not crash the build or render a broken image — falls back gracefully.
- [ ] Pasting a robot page URL into a platform that unfurls (or a local OG-preview tool) shows that robot's own name and image, not a generic one.

---

### 3.4 — JSON-LD structured data

**Do:**
- Add a `SportsTeam` (or `Organization` — pick whichever schema.org type is the better fit; `SportsTeam` is closer to what FRC teams actually are and is what the review recommended, but confirm it doesn't force fields that don't apply and fall back to `Organization` if it fights the data) JSON-LD block, rendered once, site-wide, in the root layout.
- Populate from facts already confirmed in project memory and `STATE.md` — do not invent anything not already stated:
  - `name`: "Yellowjackets" (team 9449)
  - `foundingDate`: 2023
  - `sameAs`: the real Instagram URL, `https://instagram.com/yellowjackets_9449`, and the GitHub org URL, `https://github.com/nathanwebdev2/team9449`, if a public-facing link to the repo is appropriate — flag this choice in the report, since the repo being public and the repo being *advertised* are different decisions.
  - `url`: from the `NEXT_PUBLIC_SITE_URL` env var (§3.1).
  - `logo`/`image`: only if a real logo file already exists in `public/` — do not invent a path. If none exists, omit the field and note it in the report as a Phase-C-relevant gap (sponsor/brand assets).
- Add a second, page-specific JSON-LD block on each robot detail page — schema.org doesn't have a dedicated "robot" type, so a reasonable minimal `CreativeWork` or similar with `name`, `dateCreated` (season year), and a `description` drawn only from actual MDX content (never invented) is acceptable. If a robot's content is currently too sparse (e.g. after 0011 stripped `[TK]` fields) to produce a meaningful description, **omit the block for that robot rather than emitting one with empty/null fields.**

**Acceptance:**
- [ ] Validates cleanly in Google's Rich Results Test / schema.org validator (or the closest available offline equivalent — note in the report which you used).
- [ ] No field contains invented data. Every value traces to something already true and already stated in the repo or project memory.
- [ ] A robot page with insufficient content for a meaningful `CreativeWork` block simply has none — no empty-field JSON-LD.

---

### 3.5 — Root metadata: title template and real description

**Problem:** Spec 0011 correctly removed a `[TK]` meta description that was live on every page. Nothing replaced it — the site currently ships with **no** description at all.

**Do:**
- Set a `title` template in the root layout metadata: `"%s | Yellowjackets 9449"` for inner pages, with the root/homepage title being just `"Yellowjackets 9449"` (or similar — match existing nav/brand voice, don't invent a new tagline).
- Set a real root `description`. **This is the one place in this spec where near-copywriting judgment is unavoidable** — a meta description is structural, not narrative, so draft one directly from already-confirmed facts only (founded 2023, competing FRC team, Calgary, ~25 students, Regional FIRST Impact Award). Do not draft anything about robot capabilities, records, or claims not already stated in the repo.
- Put this description in exactly one constant/variable so it's a one-line edit, and **flag it clearly and prominently in the report as a draft for Nathan's approval or edit** — same pattern as the CAD-link handling in Spec 0011: ship a safe, correct default; make it trivially editable; don't block on it.
- Each route that already has real content (`/team`, `/robots`, `/robots/[slug]`) should override title/description with something specific to that page rather than inheriting the generic root description everywhere.

**Acceptance:**
- [ ] No route ships with an empty or `[TK]` description.
- [ ] The root description is isolated to one clearly-marked constant.
- [ ] Report calls out the drafted description explicitly for Nathan's review — this is not committed as final by default.

---

### 3.6 — `not-found.tsx` and `error.tsx`

**Do:**
- `src/app/not-found.tsx` — matches the site's visual language (uses `Container`/`Section` primitives per `CLAUDE.md`, not a bare unstyled page), clear "page not found" messaging, a link back to the homepage. No invented copy beyond the standard "we couldn't find that page" register — keep it short.
- `src/app/error.tsx` — client-side error boundary per Next's convention, same visual consistency, a way to retry (`reset()`) and a way to get back to the homepage. Does not need to be clever; needs to not look broken.
- Both respect `prefers-reduced-motion` if they use any of the existing motion primitives (they don't have to use any).
- Neither references content, robots, or anything that could itself throw (avoid a 404 page whose own code can fail).

**Acceptance:**
- [ ] A non-existent route (e.g. `/this-does-not-exist`) renders the custom 404, styled consistently with the rest of the site — not the default Next.js error screen.
- [ ] `error.tsx` renders correctly when manually triggered (e.g. temporarily throwing in a test route, then removing the test).
- [ ] Both pages pass axe-core.

---

## 4. Out of scope

- Any visible page content, copy, or design changes beyond what's listed above. This spec is infrastructure.
- `/impact`, `/sponsors`, `/resources` real content — still `ComingSoon`; they only get sitemap entries and default OG/metadata coverage in this spec.
- Homepage below-the-fold sections — **Spec 0013**.
- Vercel Analytics — **Phase D**.
- Actual `team9449.ca` domain cutover — when that happens, it's a one-line env var change per §3.1, not a spec.
- Pagefind or any search functionality — later phase, already noted in `CLAUDE.md`.
- Logo/favicon design — only wire up JSON-LD `logo` if a real asset already exists; do not create one.

**Reference-tool constraint (standing rule):** 21st.dev, UI/UX Pro Max, and Godly are reference only, never source. Not particularly relevant to this spec (no new visual UI beyond OG images and two utility pages), but the rule stands, and if any layout pattern is referenced for the 404/error pages, it's layout logic only — never copied styling.

---

## 5. Data and schema changes

None. No new content fields, no database changes, no RLS implications — this spec reads existing content (`getRobots()`, `getRobotImages()`) and existing tokens; it does not modify the content schema.

---

## 6. Edge cases

- **A robot has content but zero photos** (e.g. a newly-added offseason robot before photos exist). OG image generation must fall back to the site default, not error. Structured data must omit fields it can't populate honestly.
- **`NEXT_PUBLIC_SITE_URL` unset in a preview/dev environment.** Falls back to `https://team9449.vercel.app` per §3.1 — never throws, never produces a `localhost` URL in generated metadata for a deployed build.
- **A robot's content is too sparse for a meaningful JSON-LD description** post-0011 (fields stripped, not yet rewritten). Omit that robot's `CreativeWork` block entirely rather than emitting nulls — consistent with 0011's "no invented content, no empty placeholders" precedent.
- **`/impact`, `/sponsors`, `/resources` remain `ComingSoon`.** They still get sitemap entries and inherit the default OG image — a "coming soon" page unfurling with the generic team OG image is fine; it just shouldn't be *absent* from the sitemap.
- **`error.tsx` itself must not be able to throw.** Keep it dependency-free and simple.

---

## 7. Verification before the report

Run all of these and paste the actual output, same standard as Spec 0011:

1. `npx tsc --noEmit` — clean.
2. `npm run lint` — clean.
3. `npm run build` — succeeds; confirm `/sitemap.xml` and `/robots.txt` are generated.
4. Visit `/sitemap.xml` in a built app — confirm every expected route is present, `/motion-test` is not, and URLs use the correct base (§3.1).
5. Confirm at least one per-robot OG image renders correctly and differs from the root default — screenshot or direct fetch of the generated image.
6. Validate the `SportsTeam`/`Organization` JSON-LD in a schema.org validator (or closest available offline equivalent) — paste result.
7. axe-core on `not-found.tsx` and a manually-triggered `error.tsx`.
8. Lighthouse on `/` and `/robots/2026-honeycomb` on the **Vercel preview** (not local — per the methodology note carried from Spec 0011's report) — confirm no regression from the 0011-merged baseline.
9. `grep -r "team9449.vercel.app"` — confirm the single-source-of-truth constraint from §3.1 holds.

---

## 8. Report requirements

Same standard as Spec 0011 — comes back to the planning chat before anything is pushed:

- Every file changed, and why.
- The drafted root meta description, called out explicitly for approval/edit.
- The `SportsTeam` vs. `Organization` decision and why.
- Whether the GitHub org URL was included in `sameAs` — flagged as a judgment call per §3.4.
- Confirmation of how per-robot OG images source their image (via `getRobotImages()`, not front matter) — this is a place a subtle mistake could silently break every robot's social preview.
- All verification output from §7.
- Any deviations, with reasoning — deviations reported honestly remain wanted.

---

## 9. Standing rules

- No push without planning-chat review.
- No paid tools, no accounts requiring a card.
- `CLAUDE.md` governs; flag any contradiction.
- Never invent content — this spec is more exposed to this risk than 0011 was, because metadata and structured data *feel* like infrastructure but are still public claims about the team. Every string traces to a confirmed fact.
