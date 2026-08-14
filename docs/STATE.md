# STATE

**Updated:** 2026-08-14 (rev 2)
**Phase:** 0 — Foundation

## Hard constraint — read before recommending any tool
**No paid tools of any kind, except the existing Claude Pro subscription.**
Even a "free tier requiring a card on file" counts as blocked — Nathan cannot add a card.
Every future tool suggestion must be confirmed as genuinely $0, no-card, before being proposed.

## Done
- Node 24.15.0, npm 11.12.1, git 2.54.0 installed (Windows)
- Next.js + TypeScript + Tailwind v4 scaffold created
- GitHub **organization** confirmed: `nathanwebdev2` (verified via org settings page — not a personal account)
- Repo live: `github.com/nathanwebdev2/team9449` (public)
- Deployed: https://team9449.vercel.app
- Claude Code installed in VS Code, model set to Sonnet
- `CLAUDE.md`, `globals.css` tokens, `/docs` structure written (pending confirmation of commit)

## In flight
- Nothing. Awaiting confirmation of Step 4-6 from Session 2 (globals.css check, localhost dark, live site dark, git push).

## Blocked
- Custom domain `team9449.ca` not purchased (has real cost - needs explicit budget approval when raised)
- No real content or photography yet - `[TK]` placeholders in use
- Content owner is Nathan (also the developer) - needs protected writing time

## Resolved
- ~~CodeRabbit~~ - **dropped.** Requires a card on file even on the free tier, which is blocked by the no-payment constraint. **Replaced with GitHub's built-in CodeQL (security scanning) + Dependabot (dependency alerts)** - both genuinely free, no card, native to every GitHub repo. Turned on via repo Settings -> Code security and analysis.
- The gap CodeRabbit would have filled (a second opinion on Claude Code's diffs) is covered by a `[REVIEW]` chat with the planning Claude before every merge - this was already the plan, CodeRabbit was a supplement not the foundation.
- `nathanwebdev2` confirmed as an organization, not personal account. No transfer needed.

## Next 3
1. Confirm CodeQL + Dependabot are enabled
2. Fonts + layout shell (Nav, Footer, Section, Container, Rule)
3. Motion primitives (`Reveal`, `CountUp`, `ScrubSequence`)

## Decisions since last update
- All 7 Addendum v2 decisions approved
- Rive cut (no owner named)
- Claude Code defaults to Sonnet; Opus reserved for hero scroll work and full-repo audits
- Placeholder content must be prefixed `[TK]`
- **CodeRabbit replaced with CodeQL + Dependabot due to no-payment constraint**

## Open questions for planning chat
- None blocking. Domain purchase will need explicit go-ahead when we reach it, since it's a real cost.
