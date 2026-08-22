// Design tokens duplicated as plain hex values (docs/design/tokens.md) —
// next/og's ImageResponse (satori) can't read CSS custom properties or
// Tailwind classes, only inline style objects.
const INK_900 = "#0b0c0e";
const INK_700 = "#16181c";
const JACKET_500 = "#ffc400";
const ALUMINUM = "#d7dbe0";
const STEEL_400 = "#8a9099";

/**
 * Flat-top hexagon outline, same geometry as .hero-aperture's clip-path
 * (globals.css) — the hexagon as an aperture/frame, never a background
 * pattern (CLAUDE.md §4).
 */
function HexOutline({ size }: { size: number }) {
  const h = Math.round(size * 0.866);
  const points = [
    [size * 0.25, 0],
    [size * 0.75, 0],
    [size, h / 2],
    [size * 0.75, h],
    [size * 0.25, h],
    [0, h / 2],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
      <polygon points={points} fill={INK_700} stroke={JACKET_500} strokeWidth={3} />
    </svg>
  );
}

/**
 * The default OG image treatment: hex-framed "9449" mark plus a title/
 * subtitle stack. Used as the site-wide root image, the /robots archive
 * image, and the per-robot fallback when a robot has no photos yet.
 */
export function BrandMarkImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        background: INK_900,
        alignItems: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "300px",
          height: "260px",
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HexOutline size={300} />
        <div
          style={{
            position: "absolute",
            display: "flex",
            fontFamily: "IBM Plex Mono",
            fontWeight: 500,
            fontSize: 52,
            color: JACKET_500,
          }}
        >
          9449
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginLeft: "64px" }}>
        <div
          style={{
            display: "flex",
            fontFamily: "IBM Plex Mono",
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: STEEL_400,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1.05,
            color: ALUMINUM,
            marginTop: 12,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "IBM Plex Mono",
            fontWeight: 500,
            fontSize: 24,
            color: STEEL_400,
            marginTop: 20,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
