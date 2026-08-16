# Design Tokens — Reasoning

The values themselves live in `src/app/globals.css`. This file is *why*
each value was chosen, so a future editor doesn't change something
without knowing what it was protecting against. If you're about to add
or change a token, read the relevant entry here first, and update this
file in the same commit.

## Colour

| Token | Value | Why |
|---|---|---|
| `--color-ink-900` | `#0b0c0e` | Page ground. Deliberately not pure `#000` — pure black crushes shadow detail in photos and makes the yellow accent vibrate uncomfortably on OLED screens. |
| `--color-jacket-500` | `#ffc400` | The brand yellow. Chosen over a more acid `#ffd200` and a more orange `#f5a623` — this sits at ~11.4:1 contrast against `ink-900`, readable at small sizes without glowing. **Treated as a signal colour**, meaning "look here" or "this is us" — never a background wash, never more than ~5% of a screen. |
| `--color-jacket-600` | `#c99700` | The *only* yellow permitted on light backgrounds, and only as a fill or rule — never as text. Yellow text on white/paper cannot pass WCAG AA contrast at any usable size, full stop. |
| `--color-aluminum` | `#d7dbe0` | Primary body text on dark surfaces. 12.4:1 contrast — comfortably above the 4.5:1 minimum, chosen high because dense spec tables need to stay legible at small sizes. |
| `--color-pass-500` / `--color-fault-500` | green / red | Reserved exclusively for QC pass/fail and error/success states in The Hive. Never used decoratively — if green or red shows up on the public site, something is wrong. |

## Typography

| Token | Choice | Why |
|---|---|---|
| `--font-display` | Archivo (variable) | Has a variable *width* axis, which lets the homepage hero physically expand the headline as part of the animation rather than needing a second typeface for that effect. |
| `--font-sans` / `--font-mono` | IBM Plex Sans / Mono | Commissioned by IBM specifically as an industrial/engineering type system — sans, mono, and condensed share a design language. Free, and deliberately not Inter/Space Grotesk, which are the default AI-generated-site pairing. |
| Body size `17px` | — | 16px is a browser default, not a decision. 17px reads slightly better at our chosen line length (`--measure: 68ch`). |
| `font-variant-numeric: tabular-nums` (global on mono) | — | Every stat, spec table, and count-up animation needs digits that don't shift width as they change, or numbers visibly jitter and misalign. |

## Spacing — 4px base

Chosen over an 8px base because the densest UI on the site (Hive data
tables, spec sheets) needs finer control than 8px allows without
forcing a choice between cramped and wasteful.

## Radius — 2 / 4 / 8px

Small radii read as *machined* — closer to a control panel than a
consumer app. 12–16px radii read as "SaaS product," which works
against the industrial-engineering brand. 8px is the ceiling for
anything except pills/avatars.

## Elevation — exactly two shadows

`--shadow-menu` and `--shadow-modal` are the *only* shadows in the
system. Depth everywhere else comes from border weight and value
steps (ink-900 → ink-800 → ink-700), the way a real instrument panel
creates depth — cheaper to render and more consistent with the brand
than a shadow system with many steps.

## Motion durations

`120 / 200 / 320 / 560ms` map directly to the four motion levels
(Micro / Interface / Section / Hero) defined in `CLAUDE.md` §5.
Nothing on the site exceeds 560ms except the homepage hero sequence —
past that, a returning visitor perceives the UI as sluggish.

## Hero sizing

| Token | Value | Why |
|---|---|---|
| `--hero-aperture-max` | `700px` | Caps the width of the hex-clipped scroll sequence on wide viewports. Named here rather than left inline because nothing else on the site is sized like it, but it still needs one source of truth. |
| `--hero-scroll-distance` | `280vh` | The pinned scroll travel the sequence consumes before releasing. Tuned so the 61 frames advance at a pace that reads as steady rather than rushed or draggy. |

## Breakpoints

`768px` (`--breakpoint-sm`) is the load-bearing one: it's where the
homepage's pinned scroll hero switches off entirely in favour of a
simpler autoplay-on-view sequence. Below 768px, nothing on the site
is allowed to hijack scroll, under any circumstance.
