# SPEC 0005 — Placeholder Pages for Team, Impact, Sponsors, Resources

## User story
As anyone clicking a nav link before that section is built, I see an
honest, on-brand "in progress" page instead of a broken 404. The site
is safe to show to a sponsor or judge at any point in development.

## Why this exists
The nav (spec 0002) links to `/team`, `/impact`, `/sponsors`, and
`/resources`, but only `/robots` currently exists. Every other click
currently 404s. This spec closes that gap cheaply before any of those
sections get real content and design attention later.

## Scope

1. Build one reusable component:
   `src/components/content/ComingSoon.tsx`
   - Accepts a `title` and a one-line `description`
   - Renders using `Section`/`Container`/`Eyebrow` from layout
     primitives — matches the existing dark theme, tokens only
   - Shows the page title as an `<h1>`, the description below it, and
     a small mono-style label reading something like "IN PROGRESS"
   - Includes a link back to the homepage
   - No animation beyond what a normal page already gets — this is
     intentionally the simplest possible page

2. Create four route files, each just calling `ComingSoon` with
   different text:
   - `src/app/(public)/team/page.tsx` — title "Team", description
     along the lines of "Meet the Yellowjackets — this page is under
     construction."
   - `src/app/(public)/impact/page.tsx` — "Impact"
   - `src/app/(public)/sponsors/page.tsx` — "Sponsors"
   - `src/app/(public)/resources/page.tsx` — "Resources"
   Use `[TK]` in the description text if you're unsure of exact
   wording — keep it short either way, one sentence.

3. Each page needs correct `<title>` metadata via Next's Metadata API
   (e.g. "Team — 9449 Yellowjackets") so browser tabs and search
   results aren't blank or wrong.

## Acceptance criteria
- [ ] Clicking Team, Impact, Sponsors, Resources in the nav no longer
      404s
- [ ] Each page visually matches the rest of the site (dark
      background, correct fonts, correct spacing via Section/Container)
- [ ] Each page has a distinct, correct browser tab title
- [ ] Each page has a working link back to `/`
- [ ] No new components other than `ComingSoon`
- [ ] Update `/docs/design/components.md` with `ComingSoon` and its
      four usages

## Out of scope
- Any real content for these four sections — that's future,
  dedicated specs per section
- Dropdown submenus under Sponsors/Resources

## Files this spec touches
```
src/components/content/ComingSoon.tsx     (new)
src/app/(public)/team/page.tsx            (new)
src/app/(public)/impact/page.tsx          (new)
src/app/(public)/sponsors/page.tsx        (new)
src/app/(public)/resources/page.tsx       (new)
docs/design/components.md                 (edit)
```
