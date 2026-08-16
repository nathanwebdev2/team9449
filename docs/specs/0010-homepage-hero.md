# Spec 0010 — Homepage Hero: Scroll-Driven Rotation Sequence

## User story
As a visitor landing on the homepage, I want a striking, purposeful scroll
experience where the robot turns to reveal itself as I scroll, so my first
impression of the team is technical precision and craft — not another
marketing site with a stock hero image.

## Background
This is the hero set piece described in the platform plan and design
direction ("Telemetry" aesthetic). The hexagon is treated as an
aperture/lens the robot is viewed through, not a decorative background
shape.

**Design deviation from the original plan, noted here on purpose:** the
platform plan originally described this as an "Exploded View" — the robot
assembling from separated parts. Onshape doesn't natively export an
exploded-view frame sequence the way that concept needs, so the captured
frames instead show the robot rotating in place (fixed camera distance,
slow steady turn). The mechanism below — pinned scroll, hex aperture,
frame-scrub via canvas — is unchanged; only the content inside the aperture
changed from "parts assembling" to "robot rotating." Nathan may revisit a
true exploded view later if a proper export becomes available; this spec
ships the rotation version first and is reversible.

**This replaces the `ScrubSequence` stub from spec 0008** (which rendered
`frames[0]` or a placeholder). This spec is the real implementation.

## Assets
- 61 sequential PNG frames, robot rotating steadily from its start angle
  (frame 1) to its end angle (frame 61), fixed camera distance, transparent
  background
- File location: `public/homepage/hero/frame-001.png` through
  `frame-061.png` (Nathan will place these before Claude Code starts —
  confirm they're present and correctly named before writing any code)

## Scope

### Desktop behavior
- Hero section pins in place (`position: sticky` or ScrollTrigger `pin`)
  for a scroll distance long enough to comfortably scrub all 61 frames
  without feeling rushed or sluggish — target roughly 250-300vh of scroll
  distance for the pinned section; tune by feel, not a hard number.
- Scroll position maps linearly to frame index (frame 1 at pin start,
  frame 61 at pin end) via GSAP ScrollTrigger with `scrub: true`.
- Frames render to a single `<canvas>` element (not 61 stacked `<img>` tags
  swapping visibility — canvas avoids layout/paint overhead of toggling
  DOM nodes 60x during a scroll).
- The hexagon aperture is a fixed SVG/CSS mask the canvas renders through —
  the hex shape does not move or animate; only the robot's rotation inside
  it changes as frames advance.
- All frames must be preloaded before the sequence can scrub smoothly — see
  Performance section for how this is budgeted.

### Mobile behavior
- Full 61-frame canvas scrub is out of scope for mobile — mobile viewports
  get a simpler treatment: either (a) a shorter sequence using a subset of
  frames (e.g. every 5th frame, ~12 frames) scrubbed the same way, or
  (b) a single static "hero" frame (suggest whichever frame reads best
  as a standalone shot — Claude Code's or Nathan's call) with a lighter
  Reveal-based entrance animation, no scroll-scrub.
  **Claude Code: pick whichever is simpler to implement well and state which
  in your report — this is intentionally left as an implementation choice,
  not a hard requirement, given the mobile performance budget below.**
- Breakpoint: use the project's existing Tailwind mobile breakpoint, not a
  new one.

### Reduced motion
- Uses the existing `useReducedMotion()` hook from spec 0008.
- When active: no pin, no scrub. Render one static frame immediately —
  pick the frame that reads best as a single "resting" shot of the robot
  (Claude Code's call; state which frame number was used in the report).
  No information is lost — the rotation is a stylistic reveal, not
  carrying unique content.

## Performance budget (hard requirement, from Operations Plan §7)
- LCP < 2.5s on the homepage
- Total JS for the homepage < 180KB
- CLS < 0.05
- 61 raw PNG frames will not meet this without real optimization work.
  Required:
  - Compress/re-export frames as WebP (fallback to PNG only if WebP
    conversion isn't feasible in this session — flag if so)
  - Preload strategy: do not block initial page render on all 61 frames.
    Load frame 1 eagerly (it's likely the LCP element or close to it), then
    load the remaining frames progressively while the user is still reading
    above/at the hero, so they're ready by the time scroll reaches them.
    Claude Code: describe the exact preload strategy used in the report —
    this is the highest-risk part of the spec for blowing the perf budget.
  - If, after optimization, the frame set genuinely cannot fit the JS/asset
    budget without visibly degrading quality, stop and report back with
    the numbers rather than silently shipping something over budget.

## Components
- Modified: `src/components/motion/ScrubSequence.tsx` — real implementation
  replacing the spec-0008 stub. Keep the existing prop interface if
  reasonably possible; note in the report if it had to change.
- New: `gsap` + `gsap/ScrollTrigger` as a dependency (confirmed free,
  "no charge" commercial license, no account required — already cleared,
  no further license check needed)
- Modified: homepage (`src/app/page.tsx` or equivalent) to use the real
  `ScrubSequence` in the hero position

## Out of scope (explicitly)
- Sound/audio
- User-controlled scrubbing (drag, click-to-jump) — scroll-linked only
- WebGL/3D rendering — this is a 2D canvas image sequence, not a 3D model
  in-browser
- Any hexagon animation/morphing — the aperture is static, only content
  inside it changes
- True exploded-view assembly — deferred, see Background note above
- Homepage sections below the hero (stat grid, robot teaser, etc.) —
  separate future spec

## Acceptance criteria
- [ ] Desktop: scrolling through the pinned hero smoothly scrubs frames 1→61
      (rotation) in sync with scroll position, no visible stutter on a
      typical laptop
- [ ] Hexagon aperture stays visually static; only the robot's rotation
      animates inside it
- [ ] Mobile: simplified treatment implemented and works without the full
      canvas-scrub performance cost; report states which approach was used
- [ ] `prefers-reduced-motion`: verified manually by Nathan (same process as
      spec 0008) — static frame shown immediately, no pin, no scrub
- [ ] LCP < 2.5s on the homepage (report actual measured number, e.g. via
      `next build` output or Lighthouse)
- [ ] Homepage JS < 180KB (report actual bundle size for this route)
- [ ] CLS < 0.05
- [ ] axe-core clean on the homepage; keyboard path doesn't get trapped by
      the pinned section
- [ ] Only `transform`/`opacity`-equivalent canvas operations used — no
      layout thrashing during scrub (canvas redraw is exempt from the
      "no animating layout properties" rule since it's not a DOM layout
      operation, but scroll listener work itself must not force reflow)
- [ ] Typecheck, lint, `next build` all clean
- [ ] `docs/design/components.md` updated with the real `ScrubSequence`
      entry (replacing the spec-0008 stub note)

## Model guidance
This is one of the two tasks in the whole project budgeted for Opus (per
Operations Plan §5). Nathan should switch Claude Code to Opus for this
session specifically, then back to Sonnet afterward.
