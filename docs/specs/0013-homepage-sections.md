# Spec 0013 — Homepage Below-the-Fold Sections

**Status:** Ready for implementation
**Phase:** A — Credibility (last infrastructure/layout spec before Phase A is content-only)
**Model:** Sonnet
**Branch:** `feat/0013-homepage-sections`
**Estimated:** One session
**Depends on:** Spec 0010 (hero, motion primitives), Spec 0011 (real images/alt text, safe content), Spec 0012 (this pulls real data the same way 0012's OG images did — via loaders, never front matter)

---

## 1. Goal

The homepage today is the hero and nothing else — Frame 0–3 from Spec 0010, then the page ends. This spec builds what comes after the scroll: a stat grid, a teaser into the robot archive, and teaser sections for Impact and Sponsors that push toward those (still-`ComingSoon`) pages honestly, without pretending they're finished.

**User story:** A visitor who scrolls past the hero — a sponsor's first fifteen seconds on the site, a prospective student's parent — gets a concrete sense of team scale, sees a real robot, and understands where to go next (join, sponsor, read the Impact Award story) even though two of those destination pages aren't built out yet.

**This is the last spec before Phase A becomes entirely about content Nathan and the team produce.** After this, the site's *structure* is complete; what's missing is the writeups, photos, and sponsor logos already in motion.

---

## 2. Read before starting

1. `CLAUDE.md`.
2. `docs/specs/0008-*.md` — motion primitives (`Reveal`, `CountUp`) already exist; this spec uses them, does not invent new ones.
3. `docs/specs/0010-*.md` and its report — hero performance budget. This spec's sections load *after* the hero; they must not blow the first-load JS budget the hero already spent carefully getting under.
4. `docs/specs/0011-content-integrity.md` report — **`heroImage`/`gallery` front matter do not control rendering; `getRobotImages()` reading `public/robots/<slug>/` does.** Any robot card on the homepage must source images the same way `RobotCard` already does on `/robots` — do not re-derive this a third time.
5. `docs/specs/0012-*.md` report — real root description and JSON-LD already state team facts (founding year, award). Do not restate contradictory numbers here.
6. `docs/design/tokens.md`, `docs/design/components.md`.

---

## 3. Scope — four sections, in page order

### 3.1 — Stat grid

**Problem:** No stat numbers exist anywhere in code today. The ~25 members / ~10 mentors / ~10 sponsors figures in project memory are explicitly approximate — Nathan has not supplied exact current counts.

**Do:**
- Create `content/site-stats.json` (or `.ts` — match whatever the existing content convention favours) as the **single source of truth** for every number this section displays. Do not hardcode numbers inside the component.
- Fields, populated only with values already confirmed:
  ```
  foundedYear: 2023
  firstCompetitionYear: 2024
  ```
  Every other field Claude Code cannot confirm from the repo (member count, mentor count, sponsor count, robots built) — **leave the field present but `null`, and the component omits that stat tile entirely when its value is `null`.** Do not fill in the `~25` / `~10` approximations from memory as if they were confirmed data — they were never confirmed as exact and do not belong in a public stat display presented as fact.
- Build the `StatGrid` component using the existing `CountUp` primitive from Spec 0008 for whichever stats *are* populated. A grid that currently shows two tiles (founded year, first competition year) instead of six is correct — it grows honestly as Nathan supplies real numbers, the same pattern as 0011's `SpecTable` omitting empty fields.
- **One stat is safe to include as text, not `CountUp`, without a number:** the Regional FIRST Impact Award — this is already a confirmed, specific fact (not an approximation) from project memory and already appears in 0012's JSON-LD and root description. Render it as a distinct badge/tile, not a counted number.

**Acceptance:**
- [ ] Every number on the page traces to `content/site-stats.json`, not a component-level literal.
- [ ] A `null` field renders no tile — no "—" placeholder, no zero.
- [ ] Setting a real value in the JSON and rebuilding makes that tile appear with no other code change.

---

### 3.2 — Robot archive teaser

**Do:**
- Pull real robots via the same content loader `/robots` uses (`getRobots()`), sorted by year descending, showing the 2–3 most recent.
- Render using the existing `RobotCard` component (already fixed to `h2` for a11y in Spec 0011) — do not fork a second card component for the homepage.
- Images: via `getRobotImages()`, exactly as `/robots` and 0012's OG generation already do. **Do not read `heroImage` from front matter.**
- A "View full archive →" link to `/robots`.
- If fewer than 2 robots exist with real (non-`[TK]`, non-empty) content at build time, degrade gracefully — show what's real, do not pad with placeholder cards.

**Acceptance:**
- [ ] Shows real robot names, years, and real photos — no placeholder imagery.
- [ ] Adding a new robot MDX file with photos makes it eligible to appear here automatically, same as it does on `/robots` and in the sitemap.

---

### 3.3 — Impact teaser

**Problem:** `/impact` is still `ComingSoon`. This section has to point toward it honestly.

**Do:**
- Short section, one confirmed fact as its anchor: the Regional FIRST Impact Award (Idaho). This is already stated elsewhere in the site (root description, JSON-LD from 0012) — reuse the same phrasing rather than drafting new claims about it.
- **Do not write any narrative about *why* the team won it, what the submission said, or any impact-story detail.** None of that exists in the repo yet (it's the Idaho submission document Nathan hasn't retrieved yet, per the standing content list). One sentence stating the fact plus a link to `/impact` is correct; a paragraph implying there's a story here to read is not — the visitor would click through to `ComingSoon` and feel misled.
- Link: "Read more →" to `/impact`.

**Acceptance:**
- [ ] Contains no claim beyond the award itself and the year/region.
- [ ] No invented copy about team values, culture, or impact activities.

---

### 3.4 — Sponsors teaser

**Problem:** No sponsor logos exist yet (flagged as outstanding in STATE.md). ~10 sponsors is an approximate, unconfirmed count.

**Do:**
- Do **not** display a sponsor count number here (consistent with §3.1 — unconfirmed approximations don't get displayed as fact) and do **not** attempt a logo strip with zero logos.
- Short section: a sentence about sponsorship supporting the team (generalized, not quoting or inventing any sponsor's involvement), a link to `/sponsors`, and — if a real contact channel exists — a "become a sponsor" mailto. **Check the repo for a real sponsorship contact.** If none exists beyond the general team contact already on `/team` (`christanh@albertarobotics.com`, confirmed in Spec 0006's shipped content), reuse that one rather than inventing a `sponsors@` address that doesn't exist. If genuinely nothing suitable is found, omit the contact link and just link to `/sponsors`.

**Acceptance:**
- [ ] No sponsor names, logos, or count displayed.
- [ ] Any contact link used already exists elsewhere in the repo — none invented.

---

## 4. Layout, motion, and performance

- Use `Section`/`Container` layout primitives per `CLAUDE.md` — no new layout primitives invented for this spec.
- Use `Reveal` (Spec 0008) for scroll-in treatment on each section. **Do not** attempt anything resembling the hero's pinned-scroll mechanism here — that's specific to Frame 0–3 and explicitly not to be reused for ordinary content sections.
- Respect `prefers-reduced-motion` — `Reveal`/`CountUp` already handle this per 0008; verify it still holds with the counts sourced from JSON rather than hardcoded.
- **Performance budget is tight and already scrutinized twice** (0010's hero, 0012's OG work). This spec must not push homepage first-load JS meaningfully above the number confirmed clean on the Vercel preview after 0012. If `CountUp` or any new component adds a nontrivial chunk, say so plainly in the report with the before/after number — do not bury it.

---

## 5. Out of scope

- Writing real `/impact` or `/sponsors` page content — those are their own future specs once Nathan has the Idaho submission and sponsor logos respectively.
- Any change to the hero (Frames 0–3) itself.
- Sponsor logo collection, upload, or display — needs real assets first.
- Exact member/mentor/sponsor counts — Nathan supplies these (see content list below); this spec builds the mechanism to display them the moment they exist, nothing more.
- `/team/join` CTA styling changes — that page and its own CTA are unaffected by this spec.

**Reference-tool constraint (standing rule):** 21st.dev, UI/UX Pro Max, and Godly remain reference-only, never source, per `CLAUDE.md` §3.

---

## 6. Data changes

| File | Change |
|---|---|
| `content/site-stats.json` (new) | Single source of truth for homepage stat numbers. Confirmed fields populated; unconfirmed fields explicitly `null`. |

No schema changes to robot content. No database changes, no RLS implications.

---

## 7. Edge cases

- **A stat field is `null`.** No tile renders. Grid re-flows to however many tiles are real — do not force a fixed 4- or 6-tile layout that leaves gaps.
- **Fewer than 2 robots exist with real content.** Archive teaser shows what's real; does not pad.
- **No sponsorship-specific contact exists in the repo.** Falls back to the general team contact already shipped in Spec 0006, or omits the contact link entirely if even that feels like a stretch — use judgment, note the choice in the report.
- **`CountUp` meaningfully increases bundle size.** Report it with numbers; do not silently absorb a regression into a section that's supposed to be lightweight.

---

## 8. Verification before the report

1. `npx tsc --noEmit` — clean.
2. `npm run lint` — clean.
3. `npm run build` — succeeds; report homepage first-load JS/transferred-JS, same measurement method as 0012's report, and explicitly compare to the post-0012 number.
4. Confirm the stat grid with today's `content/site-stats.json` (mostly `null`) renders cleanly with only the populated tiles — screenshot.
5. Temporarily populate one `null` stat field, rebuild, confirm the tile appears with no other change, then revert.
6. Confirm robot archive teaser shows real robots with real images (not front-matter-derived).
7. axe-core on the full homepage.
8. Lighthouse on the **Vercel preview** for `/` — compare directly to 0012's merged 100/100 baseline.
9. `prefers-reduced-motion` manual check on all three new sections.

---

## 9. Report requirements

Same standard as 0011 and 0012 — comes back for review before push:

- Every file changed, and why.
- Which stat fields were populated vs. left `null`, and confirmation none of the ~25/~10 approximations were written in as if confirmed.
- The sponsorship-contact decision (§7, edge case).
- Before/after homepage bundle size, explicitly.
- All verification output.
- Deviations, with reasoning.

---

## 10. Standing rules

- No push without planning-chat review.
- No paid tools, no accounts requiring a card.
- `CLAUDE.md` governs; flag any contradiction.
- Never invent content — this spec is at least as exposed to this risk as 0011 and 0012 were. Approximate figures from project memory are not confirmed data and do not get displayed as if they were.
