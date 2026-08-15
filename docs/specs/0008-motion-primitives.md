# SPEC 0008 — Motion Primitives

## User story
As a developer building future sections (homepage stats, robot cards
appearing on scroll), I have three ready-made, accessible motion
components to use instead of writing scroll-animation logic by hand
each time.

## Background
`CLAUDE.md` §5 defines exactly three motion primitives that every
animation on the site must be built from. None exist as code yet.
This spec builds them, with no visible page using them yet — that
comes in later specs (homepage, robot card polish).

## Scope

1. Install `motion` (the package formerly called Framer Motion) —
   confirm this is genuinely free and open-source, standard npm
   install, no account needed. Nothing else.

2. Build `src/components/motion/Reveal.tsx`
   - A wrapper component: `<Reveal>{children}</Reveal>`
   - On mount, content starts at `opacity: 0` and `transform:
     translateY(8px)`
   - When the element scrolls into view (use an IntersectionObserver,
     `motion`'s built-in `whileInView` is fine), animates to
     `opacity: 1`, `translateY(0)` over `--dur-3` (320ms) using
     `--ease-out-expo`
   - Animates once — does not replay if scrolled past and back
   - Accepts an optional `delay` prop in milliseconds, for staggering
     multiple `Reveal`s (default 0)
   - **Must respect `prefers-reduced-motion`**: if the user has that
     setting on, content should appear immediately at full opacity
     with no transform and no delay — check this with a media query
     hook, don't rely on CSS alone for a component that also changes
     JS-driven initial state
   - Only `opacity` and `transform` are animated — nothing else

3. Build `src/components/motion/CountUp.tsx`
   - Props: `value` (the final number), optional `duration` (ms,
     default ~450), optional `decimals` (default 0)
   - When scrolled into view, animates from 0 to `value`
   - Rendered digits must use `font-variant-numeric: tabular-nums`
     (already global on mono font per `globals.css`, but make sure
     this component itself renders in a mono-capable wrapper or
     accepts a className so a parent can apply the mono font)
   - Animates once on first appearance, doesn't replay
   - **Reduced motion**: jump straight to the final value, no
     counting animation
   - Easing: `--ease-out-expo`

4. Build `src/components/motion/ScrubSequence.tsx`
   - This is a **stub/skeleton only** for this spec — full
     implementation is a future spec once the actual CAD image
     sequence exists. Build:
     - The component shell accepting props: `frames` (array of image
       URLs), `className`
     - Renders a single `<img>` showing `frames[0]` (or a plain dark
       placeholder box with a small centered label reading "Sequence
       coming soon" if `frames` is empty)
     - Add a clear `// TODO(spec-future): wire up GSAP ScrollTrigger
       scrub once CAD frame export exists` comment
     - Do NOT install GSAP in this spec — that's for the future spec
       when it's actually needed
   - This exists now purely so other code can import and use the
     component name without breaking later

5. Create one temporary, throwaway test page to visually confirm all
   three work: `src/app/(public)/_motion-test/page.tsx`
   - A few `Reveal`-wrapped boxes with staggered delays
   - One `CountUp` counting to some sample number like 247
   - One `ScrubSequence` with an empty `frames` array (should show
     the placeholder)
   - This route will be deleted in a future spec once real content
     uses these components — that's expected, don't skip building it
     just because it's temporary

## Acceptance criteria
- [ ] `motion` package installed, confirmed free/no-account
- [ ] `Reveal`, `CountUp`, `ScrubSequence` all exist and match the
      behavior above
- [ ] Visiting `/_motion-test` shows staggered fade-ins, a working
      count-up animation, and the "coming soon" placeholder box
- [ ] Turning on "reduce motion" in OS settings (Windows: Settings →
      Accessibility → Visual effects → Animation effects, off) and
      reloading `/_motion-test` shows everything appearing instantly
      with no animation
- [ ] Only `opacity`/`transform` are ever animated — confirm no
      `width`/`height`/`top`/`filter` animation exists in any of the
      three components
- [ ] `next build` completes clean
- [ ] Update `/docs/design/components.md` with all three, noting
      `ScrubSequence` is a stub pending the CAD sequence

## Out of scope
- Any real page using these components yet
- GSAP / ScrollTrigger installation
- The actual homepage hero

## Files this spec touches
```
package.json                                (edit — add `motion`)
src/components/motion/Reveal.tsx            (new)
src/components/motion/CountUp.tsx           (new)
src/components/motion/ScrubSequence.tsx     (new)
src/app/(public)/_motion-test/page.tsx      (new, temporary)
docs/design/components.md                   (edit)
```
