# STATE

**Updated:** 2026-08-14 (rev 3)
**Phase:** 1 - Public site foundation

## Hard constraint - read before recommending any tool
**No paid tools of any kind, except the existing Claude Pro subscription.**
Even a "free tier requiring a card on file" counts as blocked.

## Done
- Full dev environment set up (Node, npm, git, VS Code, Claude Code on Sonnet)
- GitHub org confirmed: `nathanwebdev2` (public repo `team9449`)
- Deployed: https://team9449.vercel.app
- CodeRabbit dropped (requires card) - replaced with GitHub CodeQL + Dependabot, both enabled
- `.claude/settings.json` added to reduce permission prompts (safe commands pre-approved, destructive ones still ask)
- Spec 0002: fonts (Archivo/Plex Sans/Plex Mono), layout primitives (Container/Section/Rule/Eyebrow), Nav (sticky, compacts on scroll, keyboard-accessible mobile menu), Footer - shipped
- Spec 0003: robot content schema (Zod) + MDX loader with validation errors - shipped
- Spec 0004: `/robots` index + `/robots/[slug]` detail pages, image auto-discovery from `/public/robots/<slug>/`, SpecTable/StatGrid/RobotCard components - shipped. Lighthouse: 99/100 perf, 100 a11y (mobile); 100/100 both (desktop)
- `docs/design/tokens.md` and `components.md` written
- `content/robots/2026-honeycomb.mdx` has real content from Nathan (drivetrain, tagline, CAD link to Onshape WIP, code/binder links); photos in `public/robots/2026-honeycomb/`
- `2025-concorde.mdx` and `2024-stampede-breakfast.mdx` exist with name/year only, status "retired" (unconfirmed - flagged for Nathan to correct if wrong), no photos yet

## In flight
- Spec 0005: placeholder "coming soon" pages for /team /impact /sponsors /resources, so nav links stop 404ing on the live public site

## Blocked
- Custom domain `team9449.ca` not purchased - needs explicit budget approval
- Real content for Team/Impact/Sponsors/Resources sections - Nathan is sole content owner, also the developer
- Photo filenames in `public/robots/2026-honeycomb/` are camera dumps (IMG_1952.JPEG) - alt text is generic until renamed, not urgent

## Next 3
1. Ship spec 0005 (placeholder pages)
2. Recruitment path: `/team` + `/team/join` real content (flagged as a gap the original project spec never covered - see addendum R2)
3. Motion primitives (Reveal, CountUp) ahead of homepage hero work

## Decisions since last update
- CodeRabbit replaced with CodeQL + Dependabot (no-payment constraint)
- `nathanwebdev2` confirmed as a real GitHub organization
- Claude Code given a pre-approved command allowlist to cut down permission prompts; commit/push deliberately excluded so Nathan always sees what ships
- Content validation: distinguish `null`/empty (skip field) from literal string `"[TK]"` (also skip, was a bug, now fixed) - see `src/lib/content/is-placeholder.ts`

## Open questions for planning chat
- Confirm Concorde/Stampede Breakfast status is really "retired"
- Domain purchase timing/approval
