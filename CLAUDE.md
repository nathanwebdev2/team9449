# CLAUDE.md — Project Constitution

**Read this fully before writing any code. These rules override your defaults.**

Project: the public website and internal platform for **FRC Team 9449 Yellowjackets** (Calgary, Alberta).
Domain: `team9449.ca` · Repo: public · Deploy: Vercel

---

## 1. HOW WORK ARRIVES

**Never start a feature without a spec file at `/docs/specs/<nnnn>-<name>.md`.**

If you are asked to build something and no spec exists, stop and say so. Do not infer the requirements. Unspecified work produces plausible code that solves a slightly different problem than the one that was needed.

Before starting any task, read:
1. This file
2. `/docs/STATE.md` — current project state
3. The relevant spec file
4. `/docs/design/tokens.md` if the task touches UI

---

## 2. STACK — do not substitute

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript, strict |
| Styling | Tailwind CSS v4, tokens as CSS custom properties in `globals.css` |
| Components | shadcn/ui, copied into `/src/components/ui`, restyled to our tokens |
| UI animation | Motion (`motion/react`) |
| Scroll animation | GSAP + ScrollTrigger — **homepage only** |
| Smooth scroll | Lenis — **public routes only, never `/thehive`** |
| Backend (later) | Supabase — Postgres, Auth, Storage, RLS |
| Public search (later) | Pagefind |
| Robot stats (later) | The Blue Alliance API + Statbotics |

Do not add a dependency without asking. Do not introduce a second animation library, a CSS-in-JS library, a state manager, a headless CMS, an ORM, or a component library other than shadcn/ui.

---

## 3. BANNED PATTERNS — reject these even if asked

- `outline: none` or `outline: 0` without an equivalent visible replacement
- Animating `width`, `height`, `top`, `left`, `margin`, or `filter`. **Only `transform` and `opacity` animate.**
- `backdrop-filter` / glassmorphism **anywhere except the scrolled navigation bar**
- `any` in TypeScript. Use `unknown` and narrow it.
- Particle systems, "pollen" effects, bee flight paths, liquid/honey transitions
- Infinite marquees or auto-scrolling logo strips
- Custom cursors
- `localStorage` or `sessionStorage` for application state
- Carousels, except the mobile robot card strip
- Scroll hijacking on touch devices — **ever**
- Inline hex colours or arbitrary Tailwind values like `text-[#FFC400]` or `p-[13px]`. Use tokens.
- `!important`
- Placeholder text without the `[TK]` prefix

---

## 4. DESIGN RULES

**Tokens only.** Every colour, size, radius, duration, and breakpoint comes from `globals.css`. If a value you need doesn't exist as a token, stop and ask — do not invent one inline.

**Yellow is a signal.** `--color-jacket-500` must never exceed ~5% of any screen. It means "look here" or "this is us." It is never a background wash. **Never use yellow for text on light backgrounds** — it cannot pass contrast at any usable size.

**The hexagon is an aperture, not a texture.** Hex geometry is used as a mask, frame, or discrete cell — the stat grid, sponsor tiles, robot card crops, reveal masks. It is never a background pattern or wallpaper.

**Depth comes from border weight and value steps**, not shadows. Only two shadows exist: `--shadow-modal` and `--shadow-menu`.

**No new component without three usages.** If it's used once, it lives in the page file. Check `/docs/design/components.md` before creating anything.

**Radii are small.** 2–8px. Larger reads as consumer SaaS, not machined.

---

## 5. MOTION RULES

There are exactly **three motion primitives**. Every animation on the site is one of these, or a CSS hover transition.

| Primitive | Use |
|---|---|
| `<Reveal>` | Fade + 8px rise on scroll into view |
| `<CountUp>` | Numbers counting up, tabular figures |
| `<ScrubSequence>` | The homepage hero image sequence |

Motion levels:
- **L1 Micro** (hover, focus, press) — CSS only, 120–200ms — everywhere
- **L2 Interface** (cards, modals, nav) — Motion — 200–320ms — everywhere
- **L3 Section** (scroll reveals) — `<Reveal>` — public site only, **never in `/thehive`**
- **L4 Hero** — GSAP ScrollTrigger — **homepage only, one pinned section on the entire site**
- **L5 Interactive** — not in scope

**`prefers-reduced-motion: reduce` must lose zero information.** All L3–L5 become instant final states. Lenis disables itself. If the reduced-motion version loses meaning, the animation was decoration — delete it.

Nothing autoplays with sound. Nothing loops forever except loading indicators.

---

## 6. PERFORMANCE BUDGETS — a PR that busts these fails

| Metric | Budget |
|---|---|
| LCP (mobile, throttled 4G) | < 2.5s |
| INP | < 200ms |
| CLS | < 0.05 |
| JS, homepage | < 180KB gzipped |
| JS, inner pages | < 100KB gzipped |
| Total homepage weight | < 1.6MB |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |

Rules: `next/image` everywhere with explicit dimensions · exactly one `priority` image per page · GSAP and the sequence player are dynamically imported and only load on `/` · no autoplaying `<video>` on the homepage · self-hosted variable fonts, subset to Latin.

---

## 7. ACCESSIBILITY — WCAG 2.2 AA, non-negotiable

- **Focus:** 2px `--color-jacket-500` outline, 2px offset, visible on every surface, never removed
- Semantic HTML. One `<h1>` per page. Real `<table>` with `<th scope>` for spec tables.
- Every interactive element keyboard-reachable and operable. No keyboard traps in the pinned hero.
- Touch targets ≥ 44×44px. The Hive is used on phones, in a shop, sometimes with gloves.
- Labels, not placeholders, as the accessible name. Errors linked with `aria-describedby`, never colour alone.
- Dialogs: focus trap, `Esc` closes, focus returns to trigger, background inert.
- Body text ≥ 4.5:1 contrast. UI borders ≥ 3:1.
- Layout must survive 200% zoom and a 320px viewport.
- Decorative renders get `alt=""`. The hero sequence is `aria-hidden` with its information available as text.

---

## 8. SECURITY (from Phase 5 onward)

- **Every Supabase table has RLS enabled, default deny.** A table without RLS fails CI.
- **Every new table ships with a test asserting an unauthorized user receives zero rows.** No exceptions.
- UI hiding is cosmetic. Assume every hidden button is reachable.
- No service-role key ever reaches the client.
- Never index or expose financial amounts in search.
- This repo is **public**. No secrets in code — environment variables only.

---

## 9. CODE CONVENTIONS

```
/src/app/(public)/...     public routes
/src/app/(hive)/thehive/  authenticated app
/src/components/ui/       shadcn primitives
/src/components/layout/   Section, Container, Rule, Nav, Footer
/src/components/motion/   Reveal, CountUp, ScrubSequence
/src/components/domain/   RobotCard, SponsorCard, StatGrid, etc.
/src/lib/                 utilities
/content/                 MDX + assets
/docs/                    specs, ADRs, design, state
```

- Server Components by default. `"use client"` only where interactivity requires it, as low in the tree as possible.
- Named exports for components. `PascalCase.tsx` files.
- Conventional Commits: `feat:` `fix:` `content:` `chore:` `docs:` `refactor:`
- Keep PRs under ~400 changed lines.

---

## 10. WORKING STYLE

- **Small, verifiable changes.** Do not generate an entire feature in one response unless asked.
- **Never hide a tradeoff.** If an approach is fragile, slow, expensive, inaccessible, or over-engineered, say so before implementing.
- If a request creates disproportionate complexity, explain that first.
- If you think there's a substantially better approach than what was asked for, propose it.
- When you finish a task, state what you changed and what you did **not** do.
- Do not add features that weren't requested. Do not pad.

---

## 11. SCOPE — explicitly out

These were considered and cut. Do not build them, do not scaffold for them:

- Finance module (revenue, expenses, budgets) — sponsorship pipeline only, no dollar amounts
- Separate Mechanical / Electrical / Programming modules — one tagged Knowledge Base instead
- Electrical diagram editor
- Dashboard widget customization — role-based defaults only
- Rive animations
- Chat / messaging — Discord exists
- Public attendance leaderboards or any student-vs-student comparison
- BuzzOS — future phase, do not scaffold
- Scouting — pending evaluation of existing open-source FRC tools

---

## 12. THE TEST FOR EVERY DECISION

> Clarity > novelty. Usability > animation. Performance > effects. Authenticity > generic AI aesthetics.

The site must not look like a school project, a generic FRC site, a SaaS template, or an AI-generated landing page. Every component belongs to one system. Every animation has a reason. Every number on the site is real.
