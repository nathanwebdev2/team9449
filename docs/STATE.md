# STATE

**Updated:** 2026-08-14 (rev 5)
**Phase:** 1 - Public site foundation

## Hard constraint - read before recommending any tool
**No paid tools of any kind, except the existing Claude Pro subscription.**
Even a "free tier requiring a card on file" counts as blocked.

## Done
- Full dev environment set up (Node, npm, git, VS Code, Claude Code on Sonnet)
- GitHub org confirmed: `nathanwebdev2` (public repo `team9449`)
- Deployed: https://team9449.vercel.app
- CodeRabbit dropped (requires card) - replaced with GitHub CodeQL + Dependabot, both enabled
- `.claude/settings.json` added to reduce permission prompts (safe commands pre-approved; commit/push always ask)
- Spec 0002: fonts, layout primitives (Container/Section/Rule/Eyebrow), Nav, Footer - shipped
- Spec 0003: robot content schema (Zod) + MDX loader - shipped
- Spec 0004: `/robots` index + `/robots/[slug]` detail pages, image auto-discovery, SpecTable/StatGrid/RobotCard - shipped. Lighthouse 99-100/100
- Spec 0005: ComingSoon placeholder pages for team/impact/sponsors/resources - shipped, later team page replaced (0006)
- Spec 0006: real `/team` + `/team/join` content - shipped. $2,100 fee, schedule, subteams (CAD/Build/Programming/Business/Drive), Chris's contact (christanh@albertarobotics.com)
- Spec 0007: fixed a real Turbopack crash caused by banned arbitrary-bracket Tailwind syntax (`[var(--...)]`) - replaced with named `@utility` classes. All routes verified clean.
- `docs/design/tokens.md` and `components.md` written and kept current
- `content/robots/2026-honeycomb.mdx` has real content; photos in `public/robots/2026-honeycomb/` (filenames still camera-dump style, alt text generic - not urgent)
- `2025-concorde.mdx` / `2024-stampede-breakfast.mdx` - name/year only, status "retired" is UNCONFIRMED, still needs Nathan to verify or correct

## In flight
- Spec 0008 (motion primitives: Reveal, CountUp, ScrubSequence stub) - just handed to Claude Code, not yet confirmed/pushed by Nathan as of this update

## Blocked
- Custom domain `team9449.ca` not purchased - needs explicit budget approval when raised
- CAD image sequence for homepage hero - blocks the actual ScrubSequence implementation and the homepage hero spec entirely. Someone on CAD team needs to export ~60 frames from Onshape once CAD is tidied.
- Real content for Impact/Sponsors/Resources - still ComingSoon placeholders
- Interest form for /team/join - link not live yet, page has a "coming soon" state, needs real URL once registration opens

## Next 3
1. Confirm spec 0008 (motion primitives) works, push it
2. TBA (The Blue Alliance) API integration for auto-synced robot records/awards - doesn't need Nathan's content, just an API key (free signup, confirm no card required before proceeding)
3. Homepage hero - blocked until CAD sequence exists; in the meantime could plan/spec the non-hero parts of the homepage (stat grid, robot archive teaser, impact/sponsors teasers using ComingSoon-appropriate placeholders)

## Decisions since last update
- Model default confirmed: Sonnet for routine work, Opus reserved specifically for the homepage hero scroll sequence and full-repo audits (per operations plan) - not yet needed
- Nathan (the developer) is also the content owner - accepted risk, needs protected writing time
- This planning chat is being closed out due to length; a new chat continues from the STATE.md handoff below

## Open questions for planning chat
- Confirm Concorde/Stampede Breakfast status really is "retired"
- Domain purchase timing/approval
- Who's doing the CAD export for the hero sequence, and roughly when
