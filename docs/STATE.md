# STATE
Updated: 2026-08-16 (rev 8)
Phase: A - Credibility

## Hard constraint - read before recommending any tool
No paid tools of any kind, except the existing Claude Pro subscription. Even a "free tier requiring a card on file" counts as blocked.

## Brand
Public name is **Yellowjackets** (team 9449), not "Hive Robotics" - confirmed by Nathan 2026-08-16. Instagram is `@yellowjackets_9449` (previously logged inconsistently as `hive_robotics_yyc` - that was wrong/outdated, disregard). "The Hive" remains the correct name for the internal team-management platform only - that's a different thing and is unaffected.
A team brand board exists (provided by Nathan, not yet in the repo) - reference for §5.2 photography and any future colour/type decisions. Does not override `tokens.md` by default; if the two conflict, that's a decision to surface explicitly, not resolve silently.

## Done (cumulative, unchanged items collapsed - see rev 7 for full detail on 0002-0010)
- Specs 0002-0010 shipped (fonts/layout, content schema, robot pages, placeholders, /team, Turbopack fix, motion primitives, TBA integration, homepage hero). Full detail in STATE rev 7 / git history.
- **Spec 0011: Content integrity pass - shipped and merged to main.**
  - De-hotlinked the Honeycomb hero image (was Imgur); now local, filename `01-honeycomb-shooter-drum-closeup.jpg`, sorts first via the site's actual rendering mechanism (see finding below).
  - **Key finding, now true of the codebase going forward:** `heroImage` and `gallery` in MDX front matter are NOT read by the render path. `getRobotImages()` in `src/lib/content/robots.ts` reads `public/robots/<slug>/` directly - filename `hero.*` (or alphabetically-first file) becomes hero, rest becomes gallery, in `NN-descriptive-slug.jpg` order. `gallery` field removed from schema entirely (was dead). `heroImage` kept as a validated field (guards against external URLs) but has zero effect on rendering - **any future spec editing MDX to change what image displays must edit the filename/number in `public/`, not the front matter.**
  - Real hand-written alt text for all 14 Honeycomb photos, stored in a curated map in `robots.ts` (mechanical filename-fallback for any robot without curated entries).
  - CAD sign-in link removed; `cadUrl` now optional, schema rejects `/signin`, `/login`, `/signup`; "View CAD" only renders when a real URL is present - ready for real Onshape links with zero code change.
  - "grater" typo fixed. `[TK]` removed from both retired robots (front matter fields made optional + rejected at build time) **and** from two places outside the original spec scope where it was live on every page: `layout.tsx` meta description, `Footer.tsx` (team description, Instagram/GitHub links, contact email - footer grid adjusted 3→2 cols as a direct consequence). Nothing invented to replace any of it - fields simply omitted, per hard rule.
  - `/motion-test` deleted from production, confirmed 404.
  - Real hero CSS tokens now documented in `tokens.md` (were used inline, undocumented, since 0010).
  - One genuine a11y bug found and fixed as a deviation: `/robots` had a heading-order violation (h1→h3), `RobotCard` now uses `h2`.
  - Performance re-verified on the actual Vercel preview (not local): CLS 0 across all routes (matches pre-0011 baseline), transferred JS ~147KB on all three target routes - below every historical First-Load-JS baseline, though measured by a different method (network trace vs. Next's static analysis) so not a strict apples-to-apples number. No regression evidence. Homepage LCP read 2.3s on this Lighthouse run vs. ~400ms in the original 0010 CDP measurement - likely a throttling-methodology difference (default Lighthouse profile vs. real-Chrome-CDP) rather than a real regression, since 0011 didn't touch the homepage hero and the discrepancy showed up on an unedited page. **Not yet root-caused - see Next 3.**
  - Merged to `main`.
- **Spec 0011a: loud build failure on invalid content - shipped, pushed directly to `main`** (pre-approved tight-scope bug fix per protocol rule 3, no PR).
  - Previously: a robot MDX file failing Zod validation was silently dropped from `/robots` - no error, no build failure, just a `console.error` easy to miss in scrollback.
  - Now: any validation failure collects all issues and throws, failing `next build` with exit code 1 and a message naming the file, field, and reason. Verified with a deliberately broken test file, then a clean rebuild after removing it.
  - Directly closes the risk flagged during 0011 review: Nathan is about to hand-write six robot files, and a stray `[TK]` should now be loud, not silent.

## In flight
- None - ready to start next spec

## Blocked
- Custom domain `team9449.ca` - Nathan still expects to purchase within ~1 week (carried from rev 7, no update)
- Real content for Impact/Sponsors/Resources - still ComingSoon placeholders
- Interest form for /team/join - link not live yet
- Real Onshape CAD document URLs - still not supplied; link stays hidden until they are (see 0011 above - this is now a zero-code-change fix once links arrive)
- Six robot writeups (Concorde V2, Beebot, Krillpler + rewrite/confirm the two retired ones) - Nathan says team is starting on these now (Business subteam on the three missing robots, Honeycomb as the template)
- Photo shot list per review §5.2 - not started
- Sponsor logos - not started

## Next 3
1. **Spec 0012 - Discoverability foundation.** Unblocked as of this update (brand name resolved: Yellowjackets / `@yellowjackets_9449`). `sitemap.ts`, `robots.ts`, per-route OG images, JSON-LD (`SportsTeam`/`Organization`), canonicals, `not-found.tsx`, `error.tsx`. Highest value-per-hour spec in the plan per the review doc.
2. Root-cause the Lighthouse LCP discrepancy on the homepage (2.3s this run vs. ~400ms at spec 0010) before it becomes a false baseline for future comparisons - likely a Lighthouse-profile-vs-CDP methodology gap, not a real regression, but unconfirmed. Good candidate to fold into the Phase D full-repo audit rather than a standalone spec, since that's already the point where measurement methodology gets standardized.
3. `/team` and `/robots` first-load JS budget investigation (carried from rev 7, still not started - pre-existing, not urgent)

## Decisions since last update
- Brand name resolved: **Yellowjackets** is correct everywhere public-facing; `hive_robotics_yyc` was a stale/wrong entry, disregard it. "The Hive" (internal platform name) is unaffected and unrelated.
- `heroImage`/`gallery` MDX fields do not control rendering - documented above as a standing fact for future specs, not just a fix
- Alt text is now data (curated map in code), not derived from filenames - precedent for future robots
- 0011a treated as pre-approved tight-scope bug fix (protocol rule 3) - pushed directly, no PR/review cycle

## Open questions for planning chat
- None blocking. Brand board exists as a reference asset (not yet in repo) - revisit if/when it conflicts with a locked `tokens.md` value.
