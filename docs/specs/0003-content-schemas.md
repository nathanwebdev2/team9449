# SPEC 0003 — Robot Content Schema

## User story
As the content owner (Nathan), I can write a robot's information into
a single plain-text file following a clear template, without touching
any code, and have it become type-checked, validated content the site
can render. As a developer, adding a new robot next season means
adding one file — never editing a page's code.

## Why this is priority right now
Content has the longest lead time on the entire project (see
`/plan/9449-plan-addendum-v2.md` §4). This schema is the template the
content owner writes against, so content collection can start in
parallel with the homepage build instead of waiting for it.

## Scope

1. **Install content tooling.**
   - `zod` (schema validation)
   - `gray-matter` (parses the front-matter block at the top of an
     `.mdx` file)
   These are small, standard, free, open-source packages — normal
   `npm install`, no account or payment involved.

2. **Define the schema** in `src/lib/content/robot-schema.ts` using
   Zod, matching this shape:

   ```ts
   {
     slug: string;              // "2026-honeycomb"
     year: number;               // 2026
     name: string;                // "Honeycomb"
     game: string;                 // "Reefscape" / [TK]
     tagline: string;               // one line, [TK] until written
     status: "competed" | "retired" | "demo";

     weightLb: number | null;        // null allowed until known
     drivetrain: string | null;
     motorCount: number | null;
     notableMechanisms: string[];    // can be empty array

     cadUrl: string | null;
     codeUrl: string | null;
     binderUrl: string | null;

     heroImage: string | null;        // path under /public or /content
     gallery: string[];               // array of image paths, can be empty

     tbaTeamKey: string;                // "frc9449" — used later to
                                         // auto-fetch record/awards,
                                         // NOT fetched in this spec
   }
   ```

   Every field must have a safe default (`null`, `[]`, or an empty
   string) so a robot file can be created with almost nothing filled
   in and still pass validation. **Nothing should be "required" in a
   way that blocks creating a placeholder file today.**

3. **Build the loader**: a function in `src/lib/content/robots.ts`
   that reads every `.mdx` file in `/content/robots/`, parses its
   front matter with `gray-matter`, validates it against the Zod
   schema, and returns a typed array. If a file fails validation,
   **the dev server console must print a clear error naming the file
   and the exact field that's wrong** — this is the feedback the
   content owner needs when they make a typo.

4. **Write the reference example**: create
   `/content/robots/2026-honeycomb.mdx` using real, already-verified
   facts where we have them, and `[TK]` for everything we don't:

   ```
   ---
   slug: "2026-honeycomb"
   year: 2026
   name: "Honeycomb"
   game: "[TK]"
   tagline: "[TK]"
   status: "competed"
   weightLb: null
   drivetrain: "[TK]"
   motorCount: null
   notableMechanisms: []
   cadUrl: null
   codeUrl: null
   binderUrl: null
   heroImage: null
   gallery: []
   tbaTeamKey: "frc9449"
   ---

   [TK — engineering notes go here. What the robot does, what we're
   proud of, what we'd change next time.]
   ```

   Create two more placeholder files the same way for
   `2025-concorde.mdx` and `2024-stampede-breakfast.mdx` (names and
   years only — confirm with the content owner before assuming any
   other facts about those two).

5. **Write a short template file**: `/content/robots/_TEMPLATE.mdx`
   — the same structure as above with every field showing `[TK]` or
   an example, plus a one-paragraph comment block at the top
   explaining in plain English how to duplicate this file to add a
   new robot. This is the file the content owner actually works from.

6. **Do not build any UI.** No robot page, no card, nothing rendered
   on screen. This spec is data-layer only. Confirm it works by
   printing the parsed, validated array to the terminal console when
   the dev server starts (temporary — can be removed once confirmed,
   or left as a comment).

## Acceptance criteria
- [ ] `zod` and `gray-matter` installed, nothing else
- [ ] Schema file exists, every field has a safe default
- [ ] Loader reads all files in `/content/robots/`, validates, returns
      typed data
- [ ] A deliberately broken test file (e.g. `year: "not a number"`)
      produces a clear console error naming the file and field —
      verify this, then delete the broken test file before finishing
- [ ] Three real robot files exist with correct slugs/years/names and
      `[TK]` everywhere else
- [ ] `_TEMPLATE.mdx` exists and is written for a non-technical reader
- [ ] No UI/page changes
- [ ] Update `/docs/design/components.md` — no change needed here
      since this spec adds no components, but confirm nothing was
      accidentally added there

## Out of scope
- Fetching live stats from The Blue Alliance API (future spec)
- Any robot detail page or card UI (future spec)
- Subsystem-level data (future spec, once this base shape is proven)

## Files this spec touches
```
package.json                              (edit — two new deps)
src/lib/content/robot-schema.ts            (new)
src/lib/content/robots.ts                  (new)
content/robots/_TEMPLATE.mdx               (new)
content/robots/2026-honeycomb.mdx          (new)
content/robots/2025-concorde.mdx           (new)
content/robots/2024-stampede-breakfast.mdx (new)
```
