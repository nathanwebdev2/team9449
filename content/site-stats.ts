/**
 * Single source of truth for homepage stat numbers (spec 0013 §3.1). A field
 * is `null` until Nathan supplies the real, exact figure. `memberCount`,
 * `mentorCount`, and `sponsorCount` below were confirmed directly by Nathan
 * (2026-08-22) — they happen to match the ~25/~10/~10 figures that were
 * floating around planning docs as unconfirmed approximations, but they are
 * not sourced from that memory; they're a direct confirmation. `robotsBuilt`
 * remains unconfirmed and stays `null`. The homepage stat grid omits a tile
 * entirely when its field is `null`; setting a real value here is the only
 * change needed to make that tile appear.
 */
export interface SiteStats {
  foundedYear: number | null;
  firstCompetitionYear: number | null;
  memberCount: number | null;
  mentorCount: number | null;
  sponsorCount: number | null;
  robotsBuilt: number | null;
}

export const siteStats: SiteStats = {
  foundedYear: 2023,
  firstCompetitionYear: 2024,
  memberCount: 25,
  mentorCount: 10,
  sponsorCount: 10,
  robotsBuilt: null,
};
