# SPEC 0007 — Fix Arbitrary-Value CSS Crash

## Background
Two places in the codebase use Tailwind's arbitrary-value bracket
syntax to reference a CSS variable containing a dash:
`max-w-[var(--breakpoint-lg)]` and `z-[var(--z-nav)]`. This pattern
is already banned by `CLAUDE.md` §3 ("no arbitrary Tailwind values
like `p-[13px]`") — and it turns out there's a concrete reason beyond
style: Tailwind v4's bracket parser can corrupt a CSS variable name
containing a dash, which is currently crashing the Turbopack dev
server on every route.

This spec removes both instances properly, using Tailwind v4's
`@utility` feature to define named, reusable classes instead.

## Scope

1. In `src/app/globals.css`, inside the existing `@theme` block or
   just below it, add proper named utilities using the `@utility`
   directive:

   ```css
   @utility container-max {
     max-width: var(--breakpoint-lg);
   }

   @utility z-nav {
     z-index: var(--z-nav);
   }
   ```

   (If other `z-*` or `max-w-*` arbitrary-bracket instances exist
   anywhere else in the codebase referencing our custom tokens —
   search the whole `src/` folder for `-\[var(--` and `[var(--` to
   find any — add a matching named `@utility` for each and replace
   all of them the same way. Do not leave any arbitrary-bracket
   `var(--...)` usage anywhere in the codebase.)

2. Find every place these were used (likely `Container.tsx` and
   `Nav.tsx`) and replace:
   - `max-w-[var(--breakpoint-lg)]` → `container-max`
   - `z-[var(--z-nav)]` → `z-nav`

3. Confirm no other CSS parsing errors exist by doing a genuinely
   clean start: delete `.next`, run `npm run dev` fresh, and load
   every existing route (`/`, `/robots`, `/robots/2026-honeycomb`,
   `/team`, `/team/join`, `/impact`, `/sponsors`, `/resources`) with
   the browser's dev tools console open, confirming zero errors on
   each.

4. Also run a full `next build` to confirm production isn't silently
   affected either, even though it wasn't crashing before.

## Acceptance criteria
- [ ] No `[var(--...)]` arbitrary-bracket syntax remains anywhere in
      `src/`
- [ ] `npm run dev`, starting from a deleted `.next` folder, loads
      every route above with zero console errors and zero build
      errors
- [ ] `next build` completes clean
- [ ] Visual appearance of the nav and page containers is unchanged
      — this is a pure refactor, nothing should look different
- [ ] `docs/STATE.md` "Known issues" note about this bug is removed
      since it's now fixed

## Out of scope
- Any new content or pages
- Any visual/design changes

## Files this spec touches
```
src/app/globals.css              (edit — add @utility rules)
src/components/layout/Container.tsx   (edit — likely)
src/components/layout/Nav.tsx         (edit — likely)
docs/STATE.md                     (edit — remove resolved known issue)
```
