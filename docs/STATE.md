# STATE
Updated: 2026-08-15 (rev 6)
Phase: 1 - Public site foundation

## Hard constraint - read before recommending any tool
No paid tools of any kind, except the existing Claude Pro subscription. Even a "free tier requiring a card on file" counts as blocked.

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
- **Spec 0008: motion primitives (Reveal, CountUp, ScrubSequence stub) - shipped and pushed.** `motion` package (MIT, free, no account) installed. Reduced-motion path manually verified in-browser by Nathan (Windows Animation Effects toggle test) - all animation skips correctly, CountUp still shows correct final value. Only opacity/transform animated. `next build` clean. ScrubSequence is a placeholder stub only - real implementation blocked on CAD frame export.
- `docs/design/tokens.md` and `components.md` written and kept current
- `content/robots/2026-honeycomb.mdx` has real content; photos in `public/robots/2026-honeycomb/` (filenames still camera-dump style, alt text generic - not urgent)
- `2025-concorde.mdx` / `2024-stampede-breakfast.mdx` - name/year only, status "retired" is UNCONFIRMED, still needs Nathan to verify or correct

## In flight
- None currently - ready to start next item

## Blocked
- Custom domain `team9449.ca` not purchased - needs explicit budget approval when raised
- CAD image sequence for homepage hero - blocks the actual ScrubSequence implementation and the homepage hero spec entirely. Someone on CAD team needs to export ~60 frames from Onshape once CAD is tidied.
- Real content for Impact/Sponsors/Resources - still ComingSoon placeholders
- Interest form for /team/join - link not live yet, page has a "coming soon" state, needs real URL once registration opens

## Next 3
1. TBA (The Blue Alliance) API integration for auto-synced robot records/awards - doesn't need Nathan's content, just an API key (free signup, confirm no card required before proceeding)
2. Homepage hero - blocked until CAD sequence exists; in the meantime could plan/spec the non-hero parts of the homepage (stat grid, robot archive teaser, impact/sponsors teasers using ComingSoon-appropriate placeholders)
3. Resolve open questions below - especially content owner/CAD export owner, since those block downstream work

## Decisions since last update
- Model default confirmed: Sonnet for routine work, Opus reserved specifically for the homepage hero scroll sequence and full-repo audits (per operations plan) - not yet needed
- Nathan (the developer) is also the content owner - accepted risk, needs protected writing time
- **Operating protocol formalized**: Nathan is non-technical ("mailman" role) - all instructions to him must be exact numbered steps assuming zero prior knowledge. Planning chat writes specs only, never implementation code. Claude Code reports come back to planning chat for review before push, except pre-agreed tight bug-fix specs. Opus only for hero scroll work or full-repo audits. Planning chat proactively flags when a chat is getting long and hands off via STATE.md.

## Open questions for planning chat
- Confirm Concorde/Stampede Breakfast status really is "retired"
- Domain purchase timing/approval
- Who's doing the CAD export for the hero sequence, and roughly when
- Should the operating protocol block be saved into the repo (e.g. `docs/planning-protocol.md`) so it survives outside chat memory? (raised, not yet decided)
