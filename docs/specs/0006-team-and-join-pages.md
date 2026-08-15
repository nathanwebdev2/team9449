# SPEC 0006 — Team & Join Pages (Real Content)

## User story
As a prospective student or parent, I can read `/team` to understand
who the team is, then go to `/team/join` and get a completely honest
answer to: what does this cost, what's the time commitment, do I need
experience, and how do I actually sign up.

## IMPORTANT — content instructions
All copy below is real information from the content owner. **Use the
wording provided directly — do not invent, embellish, or add
promotional language beyond what's written here.** Where a bracket
says `[TK — reason]`, render that field as a visible, clearly-marked
"coming soon" note in context (not literal `[TK]` text) — e.g. for the
interest form link, render a disabled-looking button or plain text
that says "Interest form opening soon — check back or email
[email below]" rather than a dead/broken link.

This replaces the `/team` and `/impact`... no — **only replace
`/team`. Leave `/impact`, `/sponsors`, `/resources` as their existing
`ComingSoon` pages from spec 0005, untouched.**

## Scope

### 1. Replace `src/app/(public)/team/page.tsx`

Structure, top to bottom:

**Intro section**
- H1: "Team"
- One paragraph: 9449 Yellowjackets is a community FRC robotics team
  based in Calgary, Alberta — open to any student grades 9–12,
  regardless of school. No prior experience required.
- CTA button linking to `/team/join`: "Join the team"

**Subteams section**
- Eyebrow label: "SUBTEAMS"
- Five cards (use a `SubteamCard` component — see below), one each
  for: **CAD**, **Build**, **Programming**, **Business**, **Drive**.
  For each, write one short, honest, generic sentence describing what
  that subteam generally does on an FRC team (e.g. Build: "Turns CAD
  designs into a physical robot — machining, fabrication, and
  assembly.") Keep these factual and short, not marketing copy. If
  you're unsure of exact scope for a subteam, keep the sentence
  general rather than inventing team-specific detail.

**Where we meet**
- Short section: team meets at Renert School, our in-kind build space
  sponsor.

**Contact**
- Lead mentor contact: Chris, `christanh@albertarobotics.com`

### 2. Build `src/app/(public)/team/join/page.tsx` (new route)

Structure, top to bottom:

**Header**
- H1: "Join the Team"
- One sentence: open to any Calgary-area student, grades 9–12, no
  robotics experience required.

**The real numbers — near the top, not buried**
Use a `StatGrid` or clearly laid-out block, not a wall of prose:
- **Team fee: $2,100 CAD** — covers the full season (January through
  May) plus off-season, and includes travel (flights, hotels, local
  transit) to the CANPAC regional in Vancouver. Food during travel is
  a student/family expense.
- **CANROC regional** — held in Calgary, no additional travel cost.
- **Possible additional travel** — if the team qualifies for the
  Idaho regional or the World Championship, those involve additional
  travel costs, approximately $2,000 CAD each based on last season.
  These are not guaranteed and depend on qualification.
Present this as a clear, calm breakdown — a table or stacked stat
block, not intimidating, not apologetic. Just clear.

**Schedule**
- During build/competition season (January–May): meets Saturdays and
  Sundays, 10am–7pm.
- Typical weekly time commitment: around 12 hours.
- Commitment is flexible, but team success is directly tied to
  student involvement and participation — say this plainly, it's an
  honest expectation-setting line, not a threat.

**Competition calendar** (this season, for context — present as
informational, not a hard commitment):
- CANPAC Regional — Vancouver, early March
- Idaho Regional — end of March (if attending)
- CANROC — Calgary, dates TBD
- World Championship — late April/early May, pending qualification

**No experience needed**
- One short paragraph: genuinely open to complete beginners across
  all subteams (CAD, Build, Programming, Business, Drive).

**How to join**
- The interest form link isn't live yet. Render a clearly-styled
  "coming soon" state here — NOT a broken link, NOT literal `[TK]`
  text. Something like: a disabled-style button reading "Interest
  form — opening soon" plus a line: "In the meantime, reach out
  directly:" followed by the email below.
- Contact: Chris (lead mentor), `christanh@albertarobotics.com`,
  rendered as a working `mailto:` link.

### 3. Build `src/components/content/SubteamCard.tsx`
- Accepts `name` and `description`
- Simple bordered card matching existing token system (see
  `RobotCard` for the pattern to follow — border, radius, hover state)
- Used 5 times on `/team` — satisfies the "three usages" rule as one
  component reused five times on the same page

### 4. Update the Nav (`src/components/layout/Nav.tsx`)
- No structural change needed — `/team` already links correctly.
  Just confirm the existing "Team" nav link still points to `/team`
  (it should, don't change it if so).

### 5. Metadata
- `/team` → title "Team — 9449 Yellowjackets"
- `/team/join` → title "Join the Team — 9449 Yellowjackets"

## Acceptance criteria
- [ ] `/team` shows real subteam names and descriptions, not `[TK]`
- [ ] `/team/join` clearly shows the $2,100 fee near the top, what it
      includes, and the separate/optional Idaho+Worlds costs — a
      parent skimming for 10 seconds gets the real number
- [ ] Interest form area shows a clean "coming soon" state, not a
      dead link and not literal `[TK]` text
- [ ] Chris's email renders as a working `mailto:` link in both pages
- [ ] `/impact`, `/sponsors`, `/resources` are untouched
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95 on both new pages
- [ ] Update `/docs/design/components.md` with `SubteamCard`

## Out of scope
- The actual interest form (future — needs registration system live
  first, per content owner)
- Photos of students/mentors (need consent process first — see
  addendum §Risks R3, do not add student photos without confirming
  consent exists)
- Impact/Sponsors/Resources content

## Files this spec touches
```
src/app/(public)/team/page.tsx           (replace existing placeholder)
src/app/(public)/team/join/page.tsx      (new)
src/components/content/SubteamCard.tsx   (new)
docs/design/components.md                (edit)
```
