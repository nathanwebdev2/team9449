# Component Inventory

Rule from `CLAUDE.md` §4: **no new component without three usages.**
If something's used once, it lives in the page file. This document is
the checklist — before creating a component, check here first. Before
approving a new one, log where its three usages are.

Update this file in the same commit as any new component.

## Layout — `/src/components/layout/`

| Component | Status | Usages | Notes |
|---|---|---|---|
| `Container` | ✅ built | every page | max-width wrapper, centered, horizontal padding |
| `Section` | ✅ built | every page | owns ALL vertical section spacing — nothing else may set it |
| `Rule` | ✅ built | Nav (Hive separator), Footer, `/team/join` (section dividers) | hairline divider |
| `Eyebrow` | ✅ built | `/team` (Subteams section label) | mono uppercase label; takes `as` prop so it can render as a real heading (`as="h2"`) when it's the only label for a section, keeping heading order sequential |
| `Nav` | ✅ built | every page (via root layout) | sticky, compacts on scroll, mobile panel |
| `Footer` | ✅ built | every page (via root layout) | |

## Motion — `/src/components/motion/`

| Component | Status | Usages | Notes |
|---|---|---|---|
| `Reveal` | ✅ built (spec 0008) | none yet — homepage stat grid, robot cards, impact section planned | fade + 8px rise, in-view triggered once, `prefers-reduced-motion` skips straight to final state |
| `CountUp` | ✅ built (spec 0008) | none yet — homepage stat grid planned | counts once on in-view, tabular figures via `.font-mono`, reduced-motion jumps to final value |
| `ScrubSequence` | ✅ built (spec 0010) | homepage hero — the only L4 section on the site, by design | 61-frame CAD rotation scrubbed to a `<canvas>` clipped to a flat-top hex aperture. Pin is CSS `position: sticky`, **not** ScrollTrigger `pin` — GSAP only reads scroll progress, so no pin-spacer and no CLS. Layout (track height, sticky stage, reduced-motion collapse) lives in `globals.css` so it is right on first paint. Frame 1 is a server-rendered poster and the LCP element; frames 2–61 load on `requestIdleCallback` at concurrency 6, desktop-only. Mobile (`<48rem`), `prefers-reduced-motion`, and Save-Data all keep the poster and never fetch GSAP or the other 60 frames. Props: `frames`, `children` (rendered in the pinned stage), `className` |

## Content — `/src/components/content/`

| Component | Status | Usages | Notes |
|---|---|---|---|
| `SpecTable` | ✅ built | `/robots/[slug]` | label/value pairs, mono values, real `<table>` markup, skips empty/null rows |
| `StatGrid` | ✅ built (spec 0004) | `/robots/[slug]` | big-number stat cells, skips empty/null stats; still needed on homepage + impact |
| `RobotCard` | ✅ built | `/robots` index | hero image or initial placeholder, name, year, tagline, status badge |
| `CompetitionRecord` | ✅ built (spec 0009) | `/robots/[slug]` | events/results table + awards list, sourced from TBA (`src/lib/tba.ts`), skips rendering entirely if no TBA data or the fetch fails |
| `SponsorCard` / `SponsorGrid` | ⏳ not started | `/sponsors`, homepage | hex-cell tiles, sized by tier |
| `SubteamCard` | ✅ built (spec 0006) | `/team` (×5: CAD, Build, Programming, Business, Drive) | name + description, border/radius/hover pattern follows `RobotCard` |
| `PersonCard` | ⏳ not started | — | no student/mentor photos yet — consent process not in place |
| `ComingSoon` | ✅ built (spec 0005) | `/impact`, `/sponsors`, `/resources` | title + description + "in progress" label + link home, no animation |

## UI primitives — `/src/components/ui/`

Not started. Populated from shadcn/ui, copied in and restyled to
tokens — not installed as a dependency. First real need will likely
be `Button` and `Dialog` (for the mobile nav / future search).

---

## The rule, applied

If you're tempted to build something now that only has one clear use
case (e.g. a very specific hero-only element), it belongs directly in
that page's file, not in a shared component folder. Promote it here
only once a second and third real usage exist.
