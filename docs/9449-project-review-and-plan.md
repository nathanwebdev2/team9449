# 9449 PLATFORM — PROJECT REVIEW & PLAN TO A $50,000 WEBSITE

**Prepared:** 2026-08-15
**Inputs:** every message in this planning chat, the prior chat *"Missing project description and scope clarification"*, the live repo at `github.com/nathanwebdev2/team9449` (read directly, 142 files at `main`), the Master Planning Brief, and current verification of every tool named.
**Status of this document:** supersedes nothing. Read alongside `9449-operations-plan.md` and `CLAUDE.md`.

---

# PART 1 — WHERE THE PROJECT ACTUALLY IS

## 1.1 What has been built

Ten specs, shipped in sequence, in roughly one working day of elapsed effort:

| Spec | What it delivered | Verdict |
|---|---|---|
| 0002 | Fonts, `Container`/`Section`/`Rule`/`Eyebrow`, Nav, Footer | Solid |
| 0003 | Zod-validated MDX robot schema + loader | Solid |
| 0004 | `/robots` index + `/robots/[slug]`, image auto-discovery, `SpecTable`/`StatGrid`/`RobotCard` | Lighthouse 99–100 |
| 0005 | `ComingSoon` placeholders for 4 sections | Correct stopgap |
| 0006 | Real `/team` + `/team/join` | Only fully-written section on the site |
| 0007 | Turbopack crash fix (banned Tailwind bracket syntax) | Real bug, real fix |
| 0008 | Motion primitives: `Reveal`, `CountUp`, `ScrubSequence` | Reduced-motion verified |
| 0009 | TBA API integration → `CompetitionRecord` | Live competition data, cached, degrades gracefully |
| 0010 | Homepage hero rotation scrub | 83MB → 1.14MB, LCP ~400ms, CLS 0.0001 |

**The engineering is genuinely good.** Not "good for a student project" — good. The spec-per-feature discipline, the review gate before every push, the fact that Claude Code caught and reported its own deviations three separate times (the `_motion-test` routing bug, the missing TBA `/statuses` endpoint, the `gsap-core` CSSPlugin runtime dependency) — that is a mature process. Most agencies do not review this carefully.

The performance numbers are better than most commercial sites ship. LCP around 400ms against a 2.5s budget, CLS of 0.0001, first-load JS inside 180KB with a 61-frame scroll sequence on the page. The hex-clip insight on the frame pipeline — encode only the pixels that are ever visible through the aperture — is the kind of optimization that comes from understanding the constraint, not from following a checklist.

## 1.2 The number that matters

Here is the entire diagnosis in one table. Byte counts pulled from the repo:

| File | Size | What it is |
|---|---|---|
| `CLAUDE.md` | 8,814 B | Process documentation |
| `docs/specs/*` (9 files) | ~43,800 B | Process documentation |
| `docs/design/*` + `STATE.md` + protocol | ~15,000 B | Process documentation |
| **Total process documentation** | **~67,600 B** | |
| | | |
| `content/robots/2026-honeycomb.mdx` | 1,852 B | Real content (~290 words) |
| `content/robots/2025-concorde.mdx` | 378 B | `[TK]` placeholder |
| `content/robots/2024-stampede-breakfast.mdx` | 398 B | `[TK]` placeholder |
| **Total public-facing robot content** | **2,628 B** | |

**There is 26× more documentation about how to build the site than there is content on the site.**

That ratio is the whole story. You have built an excellent machine for producing a website and have not yet fed it a website.

## 1.3 Specific gaps found in the repo

These are not opinions; they are things I read in the files.

**Content**
- Two of three robots are `[TK]` stubs. `game`, `tagline`, `drivetrain` all literally read `"[TK]"` and will render as `[TK]` to a visitor who clicks them.
- Three offseason robots you mentioned — Concorde V2, Beebot, Krillpler — don't exist in the repo at all.
- 13 photos exist, all for one robot, all camera-dump filenames (`IMG_1230.JPEG`, `20260327_195706.JPEG`). Zero team photos. Zero event photos. Zero sponsor logos. Zero photos of the other five robots.
- `2026-honeycomb.mdx` has one typo in shipped public copy: "grater than 95%".

**Broken promises to the visitor**
- `cadUrl: https://cad.onshape.com/signin` — that is Onshape's *login page*, not your CAD. Anyone clicking "View CAD" hits a sign-in wall. This is worse than no link.
- `heroImage: https://i.imgur.com/0IV9GcV.jpeg` — your flagship robot's hero image is hotlinked from Imgur. It is outside Next's image pipeline (no optimization, no correct sizing), outside your control (Imgur can delete it), and it will be the first thing that breaks.
- `gallery: []` on all three robots despite 13 photos sitting in `public/robots/2026-honeycomb/`.

**Missing infrastructure the Master Brief explicitly asked for (§23 SEO, §24 Analytics)**
- No `sitemap.ts`. No `robots.ts`. No `opengraph-image`. No structured data.
- Consequence: sharing the site in a Discord, a sponsor email, or a Chief Delphi post produces a blank grey rectangle with no title. For a team whose strongest asset is an Impact Award — a *communications* award — this is the single most conspicuous omission.
- No `not-found.tsx`, no `error.tsx`.

**Shipped to production by accident**
- `/motion-test` is a live, publicly reachable, indexable route on your production site.

**Half the site is a placeholder**
- `/impact`, `/sponsors`, `/resources` are all still `ComingSoon`. That is 3 of 6 primary nav destinations.

---

# PART 2 — THE $50,000 QUESTION

You said: *"we need to ensure that the end product is still a $50,000 website."* You are right to set that bar. But I want to be precise about where the gap actually is, because the plan follows from the diagnosis, and I think your instinct about the cause is wrong.

## 2.1 What a $50k engagement actually buys

Rough allocation at a competent agency:

| Phase | Share | You have |
|---|---|---|
| Discovery, strategy, IA | 10–15% | **Done.** Two planning docs, an operations plan, a sitemap, personas. |
| Content: copywriting, photography, video | 25–30% | **~5%.** One robot description and 13 unedited phone photos. |
| Design: art direction, comps, design system | 20–25% | **~60%.** Tokens and components exist; no art direction on photography, no illustration, no section-level comps. |
| Engineering | 20–25% | **~70%.** Genuinely strong. |
| QA, SEO, analytics, launch | 10% | **~20%.** Perf and a11y are excellent; SEO is zero. |

Your "one day" concern is worth answering directly: **the day is not suspicious.** You compressed the phase AI compresses best — scaffolding, component work, schema plumbing, performance tuning. You have not touched the phases that do not compress: writing, photographing, and deciding. An agency's months are mostly spent on stakeholder rounds, content wrangling, and revisions. You've skipped the stakeholder rounds by being the only stakeholder. You cannot skip the content.

## 2.2 The central tension, stated plainly

You've asked me to integrate 21st.dev, Rive, Lenis, Godly, UI/UX Pro Max, and Three.js to push the site toward $50k. Here is my pushback, and it's the most important paragraph in this document:

> **Every tool on that list optimizes for impressive parts. A $50,000 website is not a collection of impressive parts — it is a coherent whole. The gap between a $5k site and a $50k site is almost entirely coherence and content, and adding more part-generators works against both.**

Look at your own two reference sites. United Carriers is dark, one typeface, one narrative device — a shipment moving across land, sea, air — executed relentlessly. Podium is flat, restrained, industrial, almost no motion. Neither is a showcase of techniques. Each is *one idea, held.* Both are also, tellingly, marketing sites for companies with almost no content to serve — which your site is not. You have three robots, six seasons, an Impact Award, ten sponsors, and a recruitment funnel to communicate.

You already have your one idea: **Telemetry — real data as the graphic material.** It's a strong idea and it is the correct one for a robotics team, because you are the rare organization whose real data is *genuinely interesting*. TBA integration already pipes live match records into the site. That is worth more than any animation library, because nobody else's site can do it.

Concretely, here's what pasting 21st.dev components into this project would do: `CLAUDE.md` §3 bans glassmorphism outside the nav, bans marquees and auto-scrolling logo strips, bans carousels, bans custom cursors, bans particle effects, and mandates tokens-only colour. UI/UX Pro Max's headline feature is a searchable database of 50+ styles including Glassmorphism, Neumorphism, Claymorphism and Bento grids. **Its catalogue is substantially a list of things your own constitution forbids.** Used naively, these tools don't add $45k of value — they subtract the coherence that's currently your best asset.

That doesn't mean don't use them. It means use them as *reference*, never as *source*. Section 4 sets out exactly how.

## 2.3 So what does close the gap

In priority order, with honest effort estimates:

1. **Content and photography** — the single largest lever, and the only one that requires you specifically. ~60% of remaining value.
2. **Finishing the three placeholder sections** so the site stops looking half-built. ~15%.
3. **SEO, OG images, structured data** — invisible, cheap, and the difference between a link that looks professional when shared and one that looks broken. ~10%.
4. **A craft/motion pass** — Lenis, page transitions, micro-interactions, scroll choreography on the non-hero sections. ~10%.
5. **Everything else** — 3D, Rive, advanced WebGL. ~5%, and only after 1–4.

Note that the thing you're most excited about is fifth, and the thing that decides the outcome is first. I'd be doing you a disservice to sequence it any other way.

---

# PART 3 — THE PLAN

Four phases. Every item is a numbered spec so it drops straight into the existing workflow.

## PHASE A — CREDIBILITY (specs 0011–0014)
*Goal: nothing on the site is broken, placeholder, or embarrassing when shared. This phase is unglamorous and non-negotiable.*

**Spec 0011 — Content integrity pass**
Fix everything in §1.3 under "broken promises." Migrate the Imgur hero image into `public/robots/2026-honeycomb/`; replace or remove the Onshape sign-in link; populate `gallery` from the 13 existing photos; rename photos to descriptive slugs; write real `alt` text for each; fix the "grater" typo; remove `/motion-test` from production routing.
*Sonnet. Low risk. Half a session.*

**Spec 0012 — Discoverability foundation**
`sitemap.ts`, `robots.ts`, per-route `opengraph-image` generation (Next's built-in OG image API — no dependency), JSON-LD structured data (`SportsTeam` / `Organization`), canonical URLs, `not-found.tsx`, `error.tsx`.
*Sonnet. This is the highest value-per-hour spec in the entire plan.*

**Spec 0013 — Homepage below the fold**
Stat grid with your real numbers, robot archive teaser, awards strip, recruitment CTA, Impact teaser. Uses existing `StatGrid`, `RobotCard`, `Reveal`, `CountUp`. Your confirmed figures:
> Founded 2023 · First competed 2024 · 25 members · 10 mentors · 10 sponsors · 3 season robots + 3 offseason robots · 7 awards including the **Regional FIRST Impact Award (Idaho 2026)**

**Spec 0014 — `/impact` real page**
You have a genuine story here and it is your strongest one. The Impact Award is not a robot-performance award; it is an outreach-and-communication award. This page should read like the written portion of an Impact submission, because that is what it effectively is.
*Blocked on content from you — see Part 5.*

## PHASE B — CRAFT (specs 0015–0018)
*Goal: the site feels expensive. Only starts once Phase A is done.*

**Spec 0015 — Lenis + scroll choreography**
Already sanctioned in `CLAUDE.md` §2 ("Lenis — public routes only, never `/thehive`"), so this is executing an existing decision, not making a new one. Lenis is MIT, ~4KB, zero runtime dependencies, and — critically for you — it wraps the browser's native scroll rather than replacing it, so `position: sticky` keeps working. Your entire hero depends on `position: sticky`. Any smooth-scroll library that hijacks scroll instead of wrapping it would break spec 0010. Lenis also honours `prefers-reduced-motion` natively, disabling smoothing when set.

**Spec 0016 — Motion pass on existing sections**
Page transitions, nav micro-interactions, `RobotCard` hover states, staggered reveals. Motion (`motion/react`) only — already installed.

**Spec 0017 — `/sponsors` real page**
Tier structure, real logos, "Join our Alliance" pitch. *Blocked on logo assets from you.*

**Spec 0018 — `/resources` hub**
CAD, code, technical binder, Chief Delphi, business resources. Reference `team4414.com` for the binder pattern as you originally flagged.

## PHASE C — CONTENT COMPLETION
*Runs in parallel with A and B, on your time, not Claude Code's. See Part 5.*

## PHASE D — AUDIT & LAUNCH
Full-repo audit (**this is your second and final budgeted Opus use**), Lighthouse across all routes, real-device testing, `team9449.ca` cutover, analytics (Vercel Analytics is free on Hobby).

**Only after all four phases** do 3D or Rive become sensible conversations.

---

# PART 4 — TOOLCHAIN, VERIFIED

Every entry checked against your hard constraint. "Card required" = blocked.

| Tool | Genuinely free? | Verdict |
|---|---|---|
| **Lenis** | Yes — MIT, npm, no account | **Use.** Already in `CLAUDE.md`. Spec 0015. |
| **GSAP + ScrollTrigger** | Yes — free for commercial use since the Webflow acquisition | **In use.** No further check needed. |
| **Godly** (godly.website) | Yes — free browsing, no account | **Use as reference only.** Never as source. |
| **21st.dev** | Yes — every signed-in user gets 2 free component copies per day; browsing, previewing and searching are unlimited and open. GitHub/Google login, no card. | **Use narrowly.** See below. |
| **UI/UX Pro Max** | Yes — MIT, `git clone` from `nextlevelbuilder/ui-ux-pro-max-skill` | **Install, use selectively.** See warning below. |
| **Anthropic `frontend-design` skill** | Yes — built in | **Use.** Better default fit than UI/UX Pro Max here. |
| **Three.js / react-three-fiber** | Yes — MIT | **Defer.** Not before Phase D. |
| **Pagefind** | Yes — MIT, build-time static search | Already in `CLAUDE.md`. Later phase. |
| **Statbotics API** | Yes — free public API | Later phase, pairs with TBA. |
| **Vercel Analytics** | Yes on Hobby | Phase D. |
| **Rive** | **NO — blocked.** Editor free, but **exports require a paid plan** (from $9/mo). You cannot ship a `.riv` without paying. | **Cut.** One exception: Rive offers export access for qualified educational use — email `support@rive.app` describing the team. If granted, revisit. |
| **CodeRabbit** | No — card required | Already dropped. Planning-chat review has replaced it and is working. |

## 4.1 How to use 21st.dev and UI/UX Pro Max without wrecking the design system

Both tools are built for projects with *no* design system. You have one. So:

**Rule: they inform specs, they never produce shipped code.**

- Browse 21st.dev for *structural* patterns — how a stat block is laid out, how a pricing/tier table is arranged for the sponsor page, how a resource grid is organized. Take the **layout logic**. Leave the styling.
- Every component that lands in the repo is written by Claude Code, in your tokens, against `CLAUDE.md`. If a 21st.dev component uses `backdrop-filter` or an inline hex, it is not a candidate for adaptation — it's a candidate for looking at once and closing.
- UI/UX Pro Max is most useful for its **UX guidelines and accessibility checklists**, least useful for its style database. Instruct Claude Code to use it for review passes, not generation.
- I'll write the constraint into each relevant spec so Claude Code doesn't have to interpret it.

## 4.2 A daily reference routine

You asked for a plan to make the most of free daily allowances. Two honest notes first: 21st.dev's free tier is designed for exactly this kind of steady use, so a daily cadence is squarely within its terms — and creating extra accounts to multiply the allowance would not be, so we won't. Second, the bottleneck on this project isn't component availability; it's decisions and content. Don't let collecting become a substitute for building.

**~15 minutes, on days you're working:**
1. **Godly** — filter to dark / editorial / technical. Screenshot anything that solves a problem you currently have. Save to a `references/` folder outside the repo.
2. **21st.dev** — search only for the *specific* pattern the current spec needs. Copy at most your 2 free components. Do not browse for inspiration; browse with a question.
3. **Log it** — one line in a `docs/design/references.md`: what you saw, what problem it solves, which spec it applies to.

That third step is what converts collecting into design direction. Unlogged references are just screenshots.

---

# PART 5 — WHAT ONLY YOU CAN DO

This is the critical path. Claude Code cannot start Phase C, and Phases A and B will finish faster than this list will.

## 5.1 Writing — highest priority

For each of the six robots (Stampede Breakfast 2024, Concorde 2025, Honeycomb 2026, Concorde V2, Beebot, Krillpler), 200–300 words answering:
- What game/season, and what was the strategic idea?
- What was the standout mechanism, and why that approach?
- What are you proud of?
- What would you change?

You've already written exactly this for Honeycomb, and it's good. Five more of those and the archive is done. **This is roughly 1,500 words total and it is worth more to the site than every remaining line of code.**

Also needed: the Impact story (what outreach, how many reached, what changed), sponsor tier descriptions, and 2–3 student testimonials.

## 5.2 Photography — second priority

The 13 existing photos are unedited phone shots. A shot list worth capturing:
- Each robot, clean background, consistent angle — the archive's visual spine
- Team group shot
- Action shots: build sessions, competition, outreach
- Detail shots: hands on parts, wiring, CAD screens — this is what sells "Telemetry"
- Mentor/student portraits for testimonials

Consistency beats quality. Twelve photos shot the same way look professional; forty shot inconsistently look like a folder.

## 5.3 Decisions pending
- CAD links: real public Onshape document URLs, or remove the link entirely
- `team9449.ca` — you said ~1 week
- Instagram is `hive_robotics_yyc` but the site says Yellowjackets. Resolve or the brand reads inconsistent to a sponsor who checks both.
- Rive educational access: send the email or drop Rive permanently

---

# PART 6 — RISKS

1. **Content never arrives.** The dominant risk. You are the only content owner, and it was flagged as a risk in the first planning chat and is still unresolved. Mitigation: recruit a student writer from the Business subteam. Six robot writeups is a genuinely good student assignment.
2. **Tool-driven incoherence.** Discussed at length in §2.2. Mitigation: the reference-not-source rule.
3. **Scope creep into The Hive.** The Hive is 12 modules and a separate product. The public site is not done. Do not start.
4. **Perfectionism on the hero while `/impact` says "Coming Soon."** Watch for this one; it's the most likely failure mode given what you enjoy building.
5. **Vercel Hobby.** You're compliant today. You would stop being compliant if you added payment processing. Sponsor logos and donation asks are fine.
6. **The `/team` and `/robots` JS budget overrun** surfaced in spec 0010's measurements (173.8KB and 179.3KB against a stated 100KB inner-page budget). Pre-existing, not urgent, but it should get a spec before the audit.

---

# PART 7 — FIRST MESSAGE FOR THE NEW CHAT

Copy everything below the line into a new chat, along with `docs/planning-protocol.md` and the current `docs/STATE.md`.

---

**9449 PLATFORM — PHASE A KICKOFF**

Continuing the 9449 Yellowjackets platform build. Attached: `docs/STATE.md`, `docs/planning-protocol.md`, and `9449-project-review-and-plan.md` (the full review and forward plan — read it first, it supersedes older assumptions about the toolchain).

**Where we are:** specs 0002–0010 shipped. Engineering foundation, robot archive, TBA live competition data, and the homepage hero scroll sequence are all done and performing well (LCP ~400ms, CLS 0.0001, first-load JS 175.2KB).

**What the review concluded:** the build is strong; the site is content-starved and missing its discoverability layer. The repo holds ~26× more process documentation than public content. Phase A fixes credibility before any further craft work.

**My role is unchanged** — I am non-technical and act as courier between this chat and Claude Code. All instructions to me must be exact numbered steps. This chat writes specs only.

**Toolchain changes from the review, already verified:**
- Rive is **cut** — exports now require a paid plan. (Pending: student-access email to Rive.)
- Lenis is **approved** for Phase B — MIT, already sanctioned in `CLAUDE.md` §2, and it wraps native scroll so it won't break the hero's `position: sticky`.
- 21st.dev / UI/UX Pro Max / Godly are **reference only, never source.** Their default styles conflict directly with `CLAUDE.md` §3. Please write that constraint into any spec where they're relevant.
- Vercel Hobby confirmed compliant (nonprofit, unpaid developer). Never add payment processing.

**Start with Spec 0011 — content integrity pass.** Scope is in Part 3 of the review doc. Please write the spec file, then give me the exact numbered steps to save it and the handoff message for Claude Code. Sonnet, not Opus.

**Open items you should hold me to:**
- Six robot writeups, ~250 words each — I owe these and they're the critical path
- Photo shot list per §5.2
- Real Onshape CAD URLs, or confirm removal
- `team9449.ca` purchase, ~1 week out
- Instagram/site brand-name inconsistency (`hive_robotics_yyc` vs Yellowjackets)

---

# CLOSING NOTE

The reason I've pushed back this hard on the tooling question is that you asked me to hold you to the standard in the Master Planning Brief, which says: *do not simply agree with my ideas.*

You have built something genuinely good. The engineering quality is real and the process discipline is unusual. But the honest read of the repo is that you have a superb chassis with no bodywork and no driver. A visitor today lands on a beautiful rotating robot, scrolls, and finds nothing underneath. Then they click Impact and get "Coming Soon."

Fix that, and the site is worth what you want it to be worth — mostly using code you have already written. Add Three.js first, and you'll have a more impressive-looking half-finished site.

Phase A. Then craft.
