# SPEC 0004 — Robot Archive Pages

## User story
As a visitor, I can go to `/robots` and see every robot the team has
built, then click into one for full specs, photos, and links. As the
content owner, dropping photo files into a folder is enough — I never
type file paths by hand.

## Scope

1. **Image auto-discovery.** In `src/lib/content/robots.ts` (built in
   spec 0003), add a function that, for a given robot slug, reads the
   contents of `/public/robots/<slug>/` at request time and returns:
   - `hero`: the file named `hero.*` if one exists, otherwise the
     first image file alphabetically, otherwise `null`
   - `gallery`: every other image file in that folder (excluding
     whichever one was picked as hero), alphabetically sorted
   Only include real image extensions (`.jpg`, `.jpeg`, `.png`,
   `.webp`). If the folder doesn't exist at all, return `hero: null,
   gallery: []` rather than throwing an error — a robot with no
   photos yet must not crash the page.

2. **Build content components** in `src/components/content/`:
   - `SpecTable.tsx` — renders label/value pairs as a real semantic
     `<table>` with `<th scope="row">`, mono font for values, tabular
     numerals. Accepts an array of `{label, value}` and skips
     rendering a row entirely if `value` is `null`, `""`, or an empty
     array — never show "N/A" or an empty dash, just omit the row.
   - `StatGrid.tsx` — a small grid of big numbers with labels
     underneath (weight, drivetrain, motor count). Same skip-if-empty
     rule.
   - `RobotCard.tsx` — a clickable card for the archive index: hero
     image (or a plain dark placeholder box with the robot's initial
     if no hero image exists — never a broken image icon), name,
     year, tagline (or nothing if tagline is empty), status badge.

3. **Build `/robots` page** (`src/app/(public)/robots/page.tsx`):
   - Fetches all robots via the spec-0003 loader
   - Sorts by year, most recent first
   - Renders a grid of `RobotCard`
   - Page has a proper `<h1>` ("Robots" or similar) and uses
     `Section`/`Container` from the layout primitives — do not
     rebuild spacing by hand

4. **Build `/robots/[slug]` page**
   (`src/app/(public)/robots/[slug]/page.tsx`):
   - Fetches the one matching robot; if the slug doesn't match any
     robot, use Next's `notFound()` to show a proper 404, don't crash
   - Shows: hero image full-width (or placeholder box), name, year,
     tagline, status
   - `SpecTable` for weight/drivetrain/motor count/mechanisms
   - Links section: CAD, Code, Binder — **only render a link if its
     URL is not null.** For `2026-honeycomb`, the CAD link exists
     (Onshape) — render it, but label it something like "View CAD
     (work in progress)" since the content owner noted it isn't a
     finished release yet. Code and Binder links are null for now —
     don't render those rows at all.
   - Gallery: a simple grid of the remaining photos using
     `next/image`, each with real `alt` text derived from the file
     name (turn `honeycomb-drivetrain-01.jpg` into something like
     "Honeycomb drivetrain" — reasonable best effort, doesn't need to
     be perfect)
   - The MDX body content (the engineering notes / `[TK]` paragraph)
     rendered below, in a readable text column (`--measure: 68ch`)

5. **Add this page to navigation** is NOT in scope — `/robots` is
   already linked in the nav from spec 0002, nothing to change there.

## Acceptance criteria
- [ ] `/robots` shows all three robot files, sorted newest first
- [ ] `/robots/2026-honeycomb` shows real specs where filled in, and
      **cleanly omits** every field still marked `[TK]` or `null` —
      no visible "[TK]" text should ever reach the rendered page, and
      no empty dashes or "N/A"
- [ ] Honeycomb's photos render from `/public/robots/2026-honeycomb/`
      automatically, no manual path list needed
- [ ] A robot with an empty photo folder (test with
      `2025-concorde`, which has none yet) shows the placeholder box,
      not a broken image
- [ ] `/robots/not-a-real-robot` shows a proper 404, not a crash
- [ ] CAD link renders for Honeycomb with the "work in progress"
      label; Code/Binder rows don't render at all for any robot yet
- [ ] Every image has real alt text, none are empty `alt=""` unless
      genuinely decorative
- [ ] Lighthouse Performance and Accessibility both still pass at
      the budgets in CLAUDE.md §6
- [ ] Update `/docs/design/components.md` — add `SpecTable`,
      `StatGrid`, `RobotCard` with their usage locations

## Out of scope
- Homepage changes
- TBA API stats (still future)
- Subsystem-level breakdown pages
- Search or filtering on `/robots`

## Files this spec touches
```
src/lib/content/robots.ts                      (edit — add image discovery)
src/components/content/SpecTable.tsx            (new)
src/components/content/StatGrid.tsx             (new)
src/components/content/RobotCard.tsx            (new)
src/app/(public)/robots/page.tsx                (new)
src/app/(public)/robots/[slug]/page.tsx         (new)
docs/design/components.md                       (edit)
```
