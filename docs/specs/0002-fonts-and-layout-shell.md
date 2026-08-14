# SPEC 0002 — Fonts & Layout Shell

## User story
As a visitor on any device, I see the site's typography and a consistent
header/footer on every page, so the brand feels coherent before any real
content exists.

## Scope
1. Load three fonts via `next/font/google` (no downloads, no accounts,
   bundled automatically by Next.js, zero cost):
   - Archivo (variable, weights 400–800) → `--font-archivo`
   - IBM Plex Sans (400, 500, 600) → `--font-plex-sans`
   - IBM Plex Mono (400, 500) → `--font-plex-mono`
   Wire them into `src/app/layout.tsx` as CSS variables on the `<html>`
   or `<body>` tag. These variable names must match what's already
   referenced in `src/app/globals.css` (`--font-display`, `--font-sans`,
   `--font-mono`) — do not rename the tokens, only supply the fonts.

2. Build layout primitives in `src/components/layout/`:
   - `Container.tsx` — max-width wrapper, horizontal padding, centered
   - `Section.tsx` — owns ALL vertical section spacing (96px mobile /
     128px desktop, per tokens). No other component may set its own
     top/bottom section padding.
   - `Rule.tsx` — a single hairline horizontal divider using
     `--color-ink-600`
   - `Eyebrow.tsx` — small mono uppercase label component (for section
     labels like "ROBOTS" or "2026 SEASON")

3. Build `Nav.tsx` in `src/components/layout/`:
   - Logo/wordmark on the left, links to `/`
   - Center or right: `Robots · Team · Impact · Sponsors · Resources`
     as plain links to `/robots`, `/team`, `/impact`, `/sponsors`,
     `/resources` (pages don't exist yet — that's fine, link anyway)
   - Sponsors and Resources are just links for now, not dropdowns yet
     (dropdowns come in a later spec)
   - Far right, visually separated by a `Rule` or distinct styling:
     a link labeled "The Hive" pointing to `/thehive`
   - Mobile: collapses to a hamburger menu that opens a full-screen
     or slide-down panel. Must be keyboard operable and close on Esc.
   - Sticky at top. On scroll down past ~80px, compact to a shorter
     height. On scroll up, return to full height. This is the ONE
     place `backdrop-filter` glassmorphism is allowed (a subtle blur
     behind the compact nav) — nowhere else in the codebase.
   - Focus-visible states on every link per CLAUDE.md §7.

4. Build `Footer.tsx` in `src/components/layout/`:
   - Team name/number, short one-line description (use `[TK]` for
     the actual copy)
   - Link columns: same nav links, plus social placeholders
     (Instagram, GitHub) as `[TK]` href="#"
   - Contact email placeholder: `[TK]@team9449.ca`
   - Copyright line with current year (computed, not hardcoded)

5. Wire `Nav` and `Footer` into `src/app/layout.tsx` so they appear
   on every page automatically.

6. Replace the default Next.js starter content in
   `src/app/page.tsx` with a single centered heading that just says
   "9449" in the display font, on the dark background, so we can see
   everything is working. Nothing fancier — the real homepage is a
   separate future spec.

## Acceptance criteria
- [ ] `npm run dev` shows dark background, correct fonts rendering
      (headings visibly different from body text)
- [ ] Nav is visible on every route, sticky, compacts on scroll
- [ ] Nav is fully usable via keyboard only (Tab through links, Esc
      closes mobile menu)
- [ ] Footer appears on every route
- [ ] No console errors in the browser dev tools
- [ ] No new npm packages added other than what `next/font/google`
      already includes (it requires no separate install)
- [ ] Nothing in `/src/components/ui` touched — this spec only adds
      to `/src/components/layout`
- [ ] All spacing uses tokens from `globals.css` — no arbitrary
      Tailwind values like `p-[13px]`

## Out of scope (do not build)
- Dropdown menus under Sponsors/Resources
- The actual homepage content/animation
- Any of the linked pages' real content
- Command menu / search (⌘K)

## Files this spec touches
```
src/app/layout.tsx        (edit)
src/app/page.tsx          (edit)
src/components/layout/Container.tsx   (new)
src/components/layout/Section.tsx     (new)
src/components/layout/Rule.tsx        (new)
src/components/layout/Eyebrow.tsx     (new)
src/components/layout/Nav.tsx         (new)
src/components/layout/Footer.tsx      (new)
```
