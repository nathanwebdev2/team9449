import type { Robot } from "@/lib/content/robot-schema";
import { SITE_URL } from "@/lib/site";

/**
 * Site-wide SportsTeam structured data (spec 0012 §3.4). Every field traces
 * to a fact already confirmed in docs/STATE.md or the project review doc —
 * nothing here is invented.
 *
 * `logo`/`image` is omitted: no real team logo file exists in /public yet.
 * Revisit once one does (Phase C brand/sponsor assets).
 */
export function buildSportsTeamJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: "Yellowjackets",
    foundingDate: "2023",
    url: SITE_URL,
    sameAs: ["https://instagram.com/yellowjackets_9449"],
  };
}

/**
 * Per-robot CreativeWork structured data. Returns null when the robot's MDX
 * body is empty (e.g. a retired robot post-0011 with its [TK] fields
 * stripped) — an honest omission rather than a block with an invented or
 * empty description (spec 0011 precedent, carried into 0012 §3.4).
 */
export function buildRobotCreativeWorkJsonLd(
  robot: Robot,
  body: string
): Record<string, unknown> | null {
  const description = body.trim().split(/\n\s*\n/)[0]?.trim();
  if (!description) return null;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: robot.name,
    dateCreated: String(robot.year),
    description,
    url: `${SITE_URL}/robots/${robot.slug}`,
  };
}
