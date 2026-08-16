# STATE
Updated: 2026-08-15 (rev 7)
Phase: 1 - Public site foundation

## Hard constraint - read before recommending any tool
No paid tools of any kind, except the existing Claude Pro subscription. Even a "free tier requiring a card on file" counts as blocked.

## Done
- Full dev environment set up (Node, npm, git, VS Code, Claude Code on Sonnet)
- GitHub org confirmed: `nathanwebdev2` (public repo `team9449`)
- Deployed: https://team9449.vercel.app
- CodeRabbit dropped (requires card) - replaced with GitHub CodeQL + Dependabot, both enabled
- `.claude/settings.json` added to reduce permission prompts (safe commands pre-approved; commit/push always ask)
- `docs/planning-protocol.md` added - formal operating protocol saved to repo
- Spec 0002: fonts, layout primitives (Container/Section/Rule/Eyebrow), Nav, Footer - shipped
- Spec 0003: robot content schema (Zod) + MDX loader - shipped
- Spec 0004: `/robots` index + `/robots/[slug]` detail pages, image auto-discovery, SpecTable/StatGrid/RobotCard - shipped. Lighthouse 99-100/100
- Spec 0005: ComingSoon placeholder pages for team/impact/sponsors/resources - shipped, later team page replaced (0006)
- Spec 0006: real `/team` + `/team/join` content - shipped. $2,100 fee, schedule, subteams (CAD/Build/Programming/Business/Drive), Chris's contact (christanh@albertarobotics.com)
- Spec 0007: fixed a real Turbopack crash caused by banned arbitrary-bracket Tailwind syntax - shipped
- Spec 0008: motion primitives (Reveal, CountUp, ScrubSequence stub) - shipped, reduced-motion verified by Nathan
- Spec 0009: TBA API integration - shipped. Competition Record section on robot pages (events, results, awards), 1hr ISR caching, graceful degradation if key missing or API fails. First real use of the branch → PR → Vercel preview → merge workflow.
- **Spec 0010: Homepage hero rotation sequence - shipped, pending final push.** Real `ScrubSequence` implementation replacing the 0008 stub. 61-frame CAD sequence, CSS-sticky pin + GSAP-read scroll progress (not ScrollTrigger pin), hex-aperture-clipped canvas. Frame pipeline (`scripts/build-hero-frames.mjs`, uses bundled `sharp`) took 83MB of source PNGs down to 1.14MB via hex-clip + alpha-drop + crop/downscale. Measured (real Chrome via CDP, throttled): LCP ~400ms, CLS 0.000117, first-load JS 175.2KB, both well inside budget. Mobile gets a single static frame, not a scrub (avoids GSAP + 60 frames on cellular, and CLAUDE.md bans scroll-hijacking on touch). Reduced-motion and desktop scroll both manually verified by Nathan.
  - **Design deviation, logged on purpose:** original plan called this an "Exploded View" (parts assembling). Onshape doesn't export that kind of frame sequence natively, so the shipped version is a rotation instead - same mechanism (pinned scroll, hex aperture, frame-scrub), different content inside the aperture. Reversible if Nathan sources true exploded-view frames later.
  - Source PNGs (83MB) moved to `assets/homepage/hero-src/` (gitignored), out of `public/` - avoids deploying originals.
  - Two new CSS custom properties added for hero sizing (`--hero-aperture-max`, `--hero-scroll-distance`) - **TODO: confirm these are logged in `docs/design/tokens.md`, not just used inline.**
- `docs/design/tokens.md` and `components.md` written and kept current
- `content/robots/2026-honeycomb.mdx` has real content; photos in `public/robots/2026-honeycomb/` (filenames still camera-dump style, alt text generic - not urgent)
- `2025-concorde.mdx` / `2024-stampede-breakfast.mdx` - **confirmed retired by Nathan.** Still placeholder-level content; now also showing real TBA competition data (spec 0009) above otherwise-placeholder page content. Accepted as-is for now - real data beats a gap, and these are archived/low priority for a full content pass. Revisit if Nathan wants it suppressed.

## In flight
- None currently - ready to start next item

## Blocked
- Custom domain `team9449.ca` - Nathan expects to purchase within ~1 week. Keep using Vercel's free domain until then, no action needed yet.
- Real content for Impact/Sponsors/Resources - still ComingSoon placeholders
- Interest form for /team/join - link not live yet, page has a "coming soon" state, needs real URL once registration opens

## Next 3
1. Homepage non-hero sections (stat grid, robot archive teaser, impact/sponsors teasers) - hero is done, this is the natural next homepage spec
2. Follow-up investigation: `/team` (173.8KB) and `/robots` (179.3KB) first-load JS are already close to/over the stated 100KB inner-page budget - pre-existing, surfaced by spec 0010's measurement work, not caused by it. Worth its own spec to understand and possibly trim.
3. Decide model-budget status: both of the project's two planned Opus uses are now down to one remaining (full-repo audit, still not needed yet)

## Decisions since last update
- Rotation replaces exploded-view for the hero (see Spec 0010 note above) - Onshape export limitation, not a preference change
- CSS sticky positioning + GSAP-driven scroll-progress reads chosen over GSAP ScrollTrigger's built-in pin, for zero-CLS correctness on first paint
- Interpretation clarified: the project's "180KB JS budget" language means first-load JS (standard Next.js metric), not total JS including lazy-loaded/code-split chunks
- Mobile hero gets a static frame, never a scroll-scrub - consistent with CLAUDE.md's ban on scroll-hijacking on touch devices

## Open questions for planning chat
- Should the two new hero CSS custom properties be formally added to `tokens.md`? (verify Claude Code did/didn't do this)
- Whether/when to spec the `/team` and `/robots` JS budget investigation
