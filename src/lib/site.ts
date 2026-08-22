/**
 * Single source of truth for the site's own URL (spec 0012 §3.1). Every
 * canonical URL, sitemap entry, OG image URL, and JSON-LD `url` field reads
 * from this constant — never hardcode a domain a second time anywhere else.
 *
 * Update NEXT_PUBLIC_SITE_URL and redeploy when team9449.ca goes live —
 * nothing else in the codebase needs to change. See docs/runbook.md.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://team9449.vercel.app"
).replace(/\/$/, "");
