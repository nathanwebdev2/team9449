# Runbook

Operational one-liners. Add to this file rather than burying the same
information in a commit message or a Slack thread.

## Environment variables

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The site's own canonical URL. Read in exactly one place in code (`src/lib/site.ts`) and used everywhere the site needs to know its own address — `metadataBase`, canonical links, `sitemap.ts`, `robots.ts`, and JSON-LD `url` fields. Defaults to `https://team9449.vercel.app` if unset. **When `team9449.ca` goes live: set this env var to `https://team9449.ca` in Vercel and redeploy — nothing else needs to change.** |
