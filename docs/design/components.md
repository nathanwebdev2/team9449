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
| `Rule` | ✅ built | Nav (Hive separator), Footer | hairline divider |
| `Eyebrow` | ✅ built | not yet used | mono uppercase label, ready for homepage stat sections |
| `Nav` | ✅ built | every page (via root layout) | sticky, compacts on scroll, mobile panel |
| `Footer` | ✅ built | every page (via root layout) | |

## Motion — `/src/components/motion/`

| Component | Status | Usages | Notes |
|---|---|---|---|
| `Reveal` | ⏳ spec 0003 | homepage stat grid, robot cards, impact section | fade + 8px rise, in-view triggered |
| `CountUp` | ⏳ spec 0003 | homepage stat grid | tabular figures, no jitter |
| `ScrubSequence` | ⏳ future spec | homepage hero only | GSAP ScrollTrigger scrub player |

## Content — `/src/components/content/`

| Component | Status | Usages | Notes |
|---|---|---|---|
| `SpecTable` | ⏳ not started | robot detail page | label/value pairs, mono values, real `<table>` markup |
| `StatBlock` / `StatGrid` | ⏳ not started | homepage, robot detail, impact | |
| `RobotCard` | ⏳ not started | homepage archive teaser, `/robots` index | |
| `SponsorCard` / `SponsorGrid` | ⏳ not started | `/sponsors`, homepage | hex-cell tiles, sized by tier |
| `PersonCard` / `SubteamCard` | ⏳ not started | `/team` | |

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
