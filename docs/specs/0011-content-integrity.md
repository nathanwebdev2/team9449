# Spec 0011 — Content Integrity Pass

**Status:** Ready for implementation
**Phase:** A — Credibility
**Model:** Sonnet (not Opus — this is low-risk, well-specified work)
**Branch:** `feat/0011-content-integrity`
**Estimated:** Half a session
**Depends on:** Specs 0003 (content schema), 0004 (robot pages, image auto-discovery), 0008/0010 (motion primitives, hero)

---

## 1. Goal

Nothing currently on the public site is broken, hotlinked, placeholder-visible, or misspelled.

This spec fixes only things that are already wrong. It does **not** add features, does not add content, and does not restyle anything. It is the unglamorous first half of Phase A, and it is the prerequisite for Spec 0012 (discoverability) — there is no point making pages shareable while they still contain `[TK]`, a broken CAD link, and a hotlinked hero image.

**User story:** A sponsor, a prospective student, or a Chief Delphi reader lands on any public page of the site and sees nothing that looks unfinished, broken, or careless.

---

## 2. Read before starting

1. `CLAUDE.md` — the constitution. Every rule in it applies here.
2. `docs/specs/0003-*.md` — the robot content schema and MDX loader.
3. `docs/specs/0004-*.md` — `/robots` pages and the image auto-discovery behaviour.
4. `content/robots/*.mdx` — all three files.
5. `docs/design/tokens.md` — for work item 8.

Work item 3 and 4 depend on how auto-discovery and the explicit `gallery` field interact. **Determine that from the code before changing anything**, and state your finding in the report.

---

## 3. Scope — eight work items

### 3.1 — De-hotlink the hero image

**Problem:** `content/robots/2026-honeycomb.mdx` sets `heroImage: https://i.imgur.com/0IV9GcV.jpeg`. The flagship robot's hero image is served from a third-party host, outside `next/image` optimisation, and Imgur can delete it at any time.

**Do:**
- Download the Imgur image into `public/robots/2026-honeycomb/`.
- Compare it against the 13 photos already in that folder. If it is a duplicate of one of them, use the existing local file instead of adding a second copy, and say so in the report.
- Name it per the convention in §3.3.
- Update `heroImage` in the MDX to the site-relative path (e.g. `/robots/2026-honeycomb/01-honeycomb-front-elevation.jpg`).
- Confirm the hero image renders through `next/image` with explicit dimensions and no layout shift.

**Schema guard (prevents recurrence):** extend the Zod schema in the content loader so `heroImage` must be a site-relative path beginning with `/`, and explicitly rejects strings starting with `http://` or `https://`, with a clear error message naming the offending file. `heroImage` may be omitted entirely; if omitted, the page falls back to the first gallery image, and if there is no gallery, renders no image at all — never a broken `<img>`.

**Acceptance:**
- [ ] No `content/**/*.mdx` file contains an external image URL.
- [ ] `grep -r "imgur" .` returns nothing outside git history.
- [ ] Setting `heroImage` to an external URL causes a build-time Zod error, not a silent pass.
- [ ] `/robots/2026-honeycomb` renders the hero image from `public/`.

---

### 3.2 — CAD link integrity

**Problem:** `cadUrl: https://cad.onshape.com/signin` is Onshape's login page, not the team's CAD. A visitor clicking "View CAD" hits a sign-in wall. This is worse than having no link.

**Decision:** Nathan has not yet supplied real public Onshape document URLs. Do not guess at one, do not construct one, and do not leave the sign-in link in place.

**Do:**
- Remove the `cadUrl` value from every MDX file that currently points at a sign-in page or any other non-document URL.
- Make `cadUrl` optional in the schema.
- Make the "View CAD" link render **only** when `cadUrl` is present and non-empty. When absent, the link and its surrounding label must not render — no disabled button, no "coming soon" text, no empty space.
- Add a schema refinement rejecting any `cadUrl` containing `/signin`, `/login`, or `/signup`, with an error message explaining that a public document link is required.

**Acceptance:**
- [ ] No "View CAD" affordance appears on any robot page today.
- [ ] Adding a valid `cadUrl` to an MDX file makes the link reappear with no other code change.
- [ ] A sign-in URL fails the build with a readable error.

---

### 3.3 — Rename photos to descriptive slugs

**Problem:** All 13 photos in `public/robots/2026-honeycomb/` are camera dumps (`IMG_1230.JPEG`, `20260327_195706.JPEG`). Filenames are public, appear in URLs, and are read by search engines.

**Convention:** `NN-subject-descriptor.jpg`

- `NN` — two-digit ordering prefix starting at `01`, controlling display order. The primary/hero shot is `01`.
- Lowercase, hyphen-separated, no spaces, no uppercase extensions. Normalise `.JPEG`/`.JPG` to `.jpg`.
- Describe what is visible, not what you assume. `04-drivetrain-detail.jpg` is good; `04-swerve-module.jpg` is only acceptable if a swerve module is actually identifiable in the frame.

**Do:**
- Open and view each of the 13 images before naming it. Do not name from the existing filename or from guesswork.
- Use `git mv` so history is preserved.
- Check the image auto-discovery code from Spec 0004 for extension matching and sort behaviour before renaming — if it matches on uppercase extensions or sorts in a way the `NN-` prefix would disturb, fix the discovery code in the same change and note it.
- Update every reference to the old filenames anywhere in the repo.

**If you cannot open the image files:** stop, do not invent names. Produce a numbered list of the 13 filenames in the report and request descriptions from Nathan.

**Acceptance:**
- [ ] No file in `public/robots/**` has a camera-dump filename or an uppercase extension.
- [ ] Photos display in a deliberate order, hero shot first.
- [ ] No 404s on any image on any route.

---

### 3.4 — Populate `gallery` and write real alt text

**Problem:** `gallery: []` on all three robots despite 13 photos existing. Alt text, where present, is generic.

**Do:**
- Populate `gallery` for `2026-honeycomb` from the renamed photos (or confirm auto-discovery already handles this and the empty array is vestigial — if so, remove the field rather than populate it, and say which you did and why).
- Write real alt text for every image. Rules:
  - Describe what is visible in the frame.
  - No "image of", "photo of", or "picture showing".
  - Under 125 characters.
  - Do not repeat an adjacent caption verbatim.
  - Do not assert facts you cannot see. If you cannot tell whether a mechanism is an intake or a shooter, describe it in neutral terms.
- Decorative images, if any, get `alt=""` — not a description.

**Acceptance:**
- [ ] Every `<img>`/`next/image` on a public route has alt text that a screen-reader user could act on.
- [ ] No alt text contains `[TK]`, a filename, or the word "image".
- [ ] axe-core clean on `/robots` and `/robots/2026-honeycomb`.

---

### 3.5 — Copy proofread

**Problem:** `2026-honeycomb.mdx` ships "grater than 95%" to production.

**Do:**
- Fix "grater" → "greater".
- Sweep all shipped public copy — every `content/**/*.mdx`, and any hardcoded copy in `app/**` and `components/**` — for spelling and obvious grammatical errors.
- **Fix only unambiguous errors.** Anything that is a stylistic judgement, a possible intentional choice, or a factual claim you cannot verify goes in the report as a question for Nathan. Do not rewrite his voice.

**Acceptance:**
- [ ] "grater" is gone.
- [ ] A list of every other change made, and every judgement call deferred, appears in the report.

---

### 3.6 — Remove `/motion-test` from production

**Problem:** `/motion-test` is a live, publicly reachable, indexable route on the production site. It was a development scaffold from Spec 0008; the motion primitives are now in real use in the shipped hero, so it has served its purpose.

**Do:**
- Delete the `/motion-test` route directory. Git history preserves it if it is ever needed again.
- Remove any nav links, sitemap entries, or references to it.
- Confirm nothing else imports from it.

**Acceptance:**
- [ ] `/motion-test` returns 404 in a production build.
- [ ] `npm run build` succeeds with no dangling imports.
- [ ] `grep -ri "motion-test" .` returns nothing outside git history and `docs/`.

---

### 3.7 — Suppress `[TK]` placeholders from public rendering

**Problem:** `2025-concorde.mdx` and `2024-stampede-breakfast.mdx` have `game`, `tagline`, and `drivetrain` fields whose literal value is `"[TK]"`. Those strings render to visitors today. Nathan has confirmed both robots as retired and is writing real content himself (Part 5 of the review) — but the site must not show `[TK]` in the meantime.

**Hard rule: do not invent, infer, or generate any replacement content.** No plausible-sounding drivetrain. No guessed taglines. Nothing. Content is Nathan's, and fabricated robot history on a public site is a credibility failure far worse than a gap.

**Do:**
- Make the affected schema fields optional.
- Replace `"[TK]"` values in the MDX with the field omitted entirely.
- Make the rendering components omit any field that is absent — no label, no empty row, no dash, no "TBD". A `SpecTable` with three of six rows populated shows three rows.
- Add a schema refinement that rejects `[TK]` as a field value at build time, so a placeholder can never reach production again. Nathan writes real content or leaves the field out.
- The TBA `CompetitionRecord` section (Spec 0009) is unaffected and continues to render real data on these pages.

**Acceptance:**
- [ ] `grep -r "\[TK\]" content/` returns nothing.
- [ ] `[TK]` does not appear anywhere in rendered HTML on any route.
- [ ] Both retired robot pages render cleanly with fewer fields — not with visible gaps or empty table rows.
- [ ] Re-adding `[TK]` to an MDX file fails the build.

---

### 3.8 — Log the hero CSS custom properties in `tokens.md`

**Carried open question from STATE.md rev 7.** Spec 0010 added two CSS custom properties for hero sizing: `--hero-aperture-max` and `--hero-scroll-distance`.

**Do:**
- Check whether both are documented in `docs/design/tokens.md`.
- If not, add them with their values and a one-line rationale each, matching the existing format in that file.
- If they are only used inline and not defined as tokens at all, say so in the report rather than refactoring — that becomes a separate decision.

**Acceptance:**
- [ ] `tokens.md` documents both properties, or the report explains precisely why not.

---

## 4. Out of scope

Do not do any of the following in this spec, even if you notice they need doing:

- Writing any robot descriptions, impact copy, or sponsor copy.
- `sitemap.ts`, `robots.ts`, OG images, JSON-LD, canonicals, `not-found.tsx`, `error.tsx` — all of that is **Spec 0012**.
- Homepage below-the-fold sections — **Spec 0013**.
- `/impact`, `/sponsors`, `/resources` — later specs; they stay as `ComingSoon`.
- Lenis, page transitions, hover states, any motion work — **Phase B**.
- The `/team` (173.8 KB) and `/robots` (179.3 KB) first-load JS overrun. Known, pre-existing, and getting its own spec. Do not attempt to trim it here. **However:** if any change in this spec increases those numbers, that is a regression and must be reported.
- Photo editing, colour correction, or cropping. Renaming only.

**Reference-tool constraint (standing rule, restated for every spec):** 21st.dev, UI/UX Pro Max, and Godly are **reference only, never source**. No component, class, or style from any of them is copied into this repo. Their defaults — glassmorphism, neumorphism, bento grids, inline hex colours, `backdrop-filter` — conflict directly with `CLAUDE.md` §3. Not applicable to this spec, since it adds no new UI, but the rule stands regardless.

---

## 5. Data and schema changes

| Field | Change | Reason |
|---|---|---|
| `heroImage` | Optional; must be site-relative; rejects `http(s)://` | §3.1 |
| `cadUrl` | Optional; rejects sign-in/login/signup URLs | §3.2 |
| `gallery` | Populated, or removed if auto-discovery supersedes it | §3.4 |
| `game`, `tagline`, `drivetrain` | Optional; reject literal `[TK]` | §3.7 |

No database changes. No new tables, therefore no RLS work in this spec.

---

## 6. Edge cases

- **Imgur download fails or the image is gone.** Do not substitute a random local photo silently. Use the most suitable existing local photo as hero, and flag the substitution prominently in the report for Nathan to confirm.
- **Renaming breaks auto-discovery.** Expected risk. Read the discovery code first; fix it in the same change; report exactly what changed.
- **Case-insensitive filesystem.** Use `git mv` for all renames so the extension-case normalisation is recorded properly.
- **Making a field optional breaks a type.** Fix the type. Never use `any` — `CLAUDE.md` bans it.
- **A retired robot page ends up nearly empty** once `[TK]` fields are removed. That is the correct outcome for now; the TBA competition record still renders. Do not pad it.
- **Images cannot be opened.** Stop and ask, per §3.3.

---

## 7. Verification before the report

Run all of these and paste the actual output:

1. `npm run typecheck` — clean.
2. `npm run lint` — clean.
3. `npm run build` — succeeds; report first-load JS for `/`, `/robots`, `/robots/2026-honeycomb`, `/team`, and confirm none increased.
4. Lighthouse on `/robots/2026-honeycomb` — must stay at the previous 99–100.
5. axe-core on `/robots` and `/robots/2026-honeycomb` — clean.
6. Visit `/motion-test` in a production build — confirm 404.
7. `grep -ri "imgur" .`, `grep -r "\[TK\]" content/`, `grep -ri "motion-test" .` — report output.
8. Confirm the hero scroll sequence on the homepage still works and CLS is unchanged. This spec should not touch it, but §3.8 and the image work sit close to it.

---

## 8. Report requirements

The report comes back to the planning chat for review **before anything is pushed** (planning-protocol rule 3). Include:

- Every file changed, and why.
- The 13 old → new filename mappings, with the alt text written for each.
- The auto-discovery vs `gallery` finding from §2.
- Every proofreading change made, and every judgement call deferred to Nathan.
- All verification output from §7.
- Anything you deviated from in this spec, and why. Deviations reported honestly are wanted — this project has caught three real bugs that way.

---

## 9. Standing rules

- No push without planning-chat review.
- No paid tools, no accounts requiring a card.
- `CLAUDE.md` governs. If this spec contradicts it, `CLAUDE.md` wins and you flag the contradiction.
- Never invent content.
