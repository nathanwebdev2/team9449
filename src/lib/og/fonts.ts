import fs from "node:fs";
import path from "node:path";

const ASSETS_DIR = path.join(process.cwd(), "src", "lib", "og", "assets");

let archivoBold: Buffer | null = null;
let plexMonoMedium: Buffer | null = null;

/**
 * Self-hosted (not fetched from a CDN at build/request time) font data for
 * next/og's ImageResponse — same Archivo/IBM Plex type system as the rest of
 * the site, per docs/design/tokens.md. Latin-subset .ttf files checked into
 * src/lib/og/assets/.
 */
export function ogFonts() {
  archivoBold ??= fs.readFileSync(path.join(ASSETS_DIR, "archivo-bold.ttf"));
  plexMonoMedium ??= fs.readFileSync(
    path.join(ASSETS_DIR, "ibm-plex-mono-medium.ttf")
  );

  return [
    { name: "Archivo", data: archivoBold, weight: 700 as const, style: "normal" as const },
    {
      name: "IBM Plex Mono",
      data: plexMonoMedium,
      weight: 500 as const,
      style: "normal" as const,
    },
  ];
}
