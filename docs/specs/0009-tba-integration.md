# Spec 0009 — The Blue Alliance API Integration

## User story
As a site visitor, I want to see accurate, current match records and awards for
each robot/season, without Nathan having to manually re-enter results, so that
robot pages stay correct with no ongoing content work.

## Background
The Blue Alliance (TBA) is FIRST Robotics Competition's official open data
source — team info, event results, match records, awards. Free API, requires
a personal auth key (no payment, no card). Team key for 9449 is `frc9449`.

## Scope
- Add a server-side TBA client that fetches, for team `frc9449`:
  - Season event list + results (`/team/frc9449/events/{year}`)
  - Awards won (`/team/frc9449/awards/{year}`)
- Cache responses (TBA data doesn't change often outside competition weeks;
  avoid hitting rate limits and avoid a network call on every page load).
  Use Next.js's built-in fetch caching / revalidation — no new dependency needed.
- Display fetched data on each robot's detail page (`/robots/[slug]`) in a new
  "Competition Record" section: events attended, final rank/result per event,
  awards won. Match this season's `content/robots/*.mdx` entry to its TBA year
  via the existing `year` field in the schema (see `docs/content/schemas.md`).
- If TBA has no data for a given year (e.g. very old robots, or before the
  team existed in TBA's records), the section is omitted entirely — no error
  state, no "no data" placeholder clutter.
- If the TBA API call fails (network error, TBA down) at build/request time,
  the page must still render everything else normally — competition record
  section just doesn't appear. Never let a TBA failure break the page.

## Data / environment
- New environment variable: `TBA_API_KEY` (server-side only, never exposed
  to the browser — do not prefix with `NEXT_PUBLIC_`)
- Nathan will provide the key value after signup (see handoff steps below);
  Claude Code should read it via `process.env.TBA_API_KEY` and fail gracefully
  (log a clear warning, render pages without the section) if it's missing —
  do not crash the build if the key isn't set yet.
- All TBA requests use header `X-TBA-Auth-Key: <key>`, base URL
  `https://www.thebluealliance.com/api/v3`

## Components
- New: `src/lib/tba.ts` — typed fetch wrapper for the two endpoints above,
  with Zod validation on the response shape (consistent with existing content
  schema approach — see `docs/content/schemas.md`)
- New: `CompetitionRecord` component — displays event list + results + awards,
  styled consistently with existing `SpecTable`/`StatGrid` components
  (see `docs/design/components.md`) — do not invent new visual patterns for
  this, reuse what exists
- Modified: `src/app/robots/[slug]/page.tsx` — renders `CompetitionRecord`
  when TBA data is available for that robot's year

## Out of scope (explicitly)
- Live/real-time data during competition — this is a static/cached read for
  the public marketing site, not a live dashboard (that's BuzzOS territory,
  future phase)
- Match video embeds
- District ranking/points display
- Any TBA write access (not applicable — TBA is read-only for this use case)
- Webhooks — polling with caching is sufficient for this site's needs

## Acceptance criteria
- [ ] `TBA_API_KEY` read from environment, never committed to the repo or
      exposed client-side
- [ ] Build does not fail if `TBA_API_KEY` is unset — pages render without
      the Competition Record section, with a clear console warning
- [ ] `/robots/2026-honeycomb` (or whichever robot has real 2026 TBA data)
      shows accurate event list, results, and awards matching what's live on
      thebluealliance.com/team/9449
- [ ] A robot year with no TBA data renders the page normally with no empty
      section or error visible to the user
- [ ] A simulated TBA API failure (e.g. wrong key) does not break the page —
      verify by temporarily using an invalid key value and confirming the
      page still renders
- [ ] TBA response data is cached, not fetched fresh on every request
      (Claude Code should state which caching approach was used in its report)
- [ ] Typecheck, lint, `next build` all clean
- [ ] `docs/design/components.md` updated with the new `CompetitionRecord`
      component entry
