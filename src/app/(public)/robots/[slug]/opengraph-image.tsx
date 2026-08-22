import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getRobotBySlug, getRobotImages, getRobots } from "@/lib/content/robots";
import { isPlaceholder } from "@/lib/content/is-placeholder";
import { BrandMarkImage } from "@/lib/og/brand-mark";
import { ogFonts } from "@/lib/og/fonts";

export const alt = "Robot page — Yellowjackets 9449";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getRobots().map((robot) => ({ slug: robot.slug }));
}

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/**
 * Reads the hero photo straight off disk (same public/robots/<slug>/ path
 * getRobotImages() already resolved — never front matter, per spec 0011 §2)
 * and inlines it as a data URI. ImageResponse can't resolve a site-relative
 * "/robots/..." path the way next/image can; it needs raw bytes or an
 * absolute external URL.
 */
function readHeroAsDataUri(heroSrc: string): string | null {
  const filePath = path.join(process.cwd(), "public", heroSrc);
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime || !fs.existsSync(filePath)) return null;

  const bytes = fs.readFileSync(filePath);
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  const fonts = ogFonts();

  if (!robot) {
    return new ImageResponse(
      (
        <BrandMarkImage
          eyebrow="Yellowjackets 9449"
          title="Robot Archive"
          subtitle="FIRST Robotics Competition"
        />
      ),
      { ...size, fonts }
    );
  }

  const { hero } = getRobotImages(robot.slug, robot.name);
  const dataUri = hero ? readHeroAsDataUri(hero.src) : null;

  // No photos yet (e.g. a newly-added offseason robot) — fall back to the
  // brand mark rather than erroring or rendering a broken image reference.
  if (!dataUri) {
    const subtitle =
      robot.game && !isPlaceholder(robot.game) ? robot.game : "FIRST Robotics Competition";

    return new ImageResponse(
      (
        <BrandMarkImage
          eyebrow={`Yellowjackets 9449 · ${robot.year}`}
          title={robot.name}
          subtitle={subtitle}
        />
      ),
      { ...size, fonts }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "1200px",
          height: "630px",
          background: "#0b0c0e",
        }}
      >
        {/* next/og's ImageResponse (satori) requires a raw <img> — next/image isn't supported here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUri}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            // 180deg points down, so 0% (transparent) sits at the top of the
            // frame and 100% (near-opaque) at the bottom — guarantees text
            // contrast regardless of what colour the underlying photo is.
            background:
              "linear-gradient(180deg, rgba(11,12,14,0) 0%, rgba(11,12,14,0.35) 55%, rgba(11,12,14,0.95) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "IBM Plex Mono",
              fontWeight: 500,
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              // Aluminum, not Signal Yellow — the robot's own bodywork is
              // often yellow, and jacket-500 text disappears against it.
              color: "#8a9099",
            }}
          >
            Yellowjackets 9449 · {robot.year}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: 76,
              lineHeight: 1.05,
              color: "#d7dbe0",
              marginTop: 8,
            }}
          >
            {robot.name}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
