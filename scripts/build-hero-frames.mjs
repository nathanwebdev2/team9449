// Asset pipeline for the homepage hero sequence (spec 0010).
//
// Reads the raw CAD export from assets/homepage/hero-src/ (61 PNGs, ~3296x2547
// RGBA, ~1.3MB each — 83MB total, far past the 1.6MB homepage weight budget)
// and writes optimised WebP frames into public/homepage/hero/.
//
// Run manually after a new CAD export; the output is committed, the source is
// not. Requires `sharp`, which ships with Next — it is not a project dependency.
//
//   node scripts/build-hero-frames.mjs
//
// Three things do the heavy lifting, in order of impact:
//   1. The hexagonal aperture is baked in. Everything outside it is flat
//      --color-ink-800, which costs almost nothing to encode and is never seen
//      anyway because the canvas is clipped to the same hexagon.
//   2. The alpha channel is dropped. The frames composite onto one known
//      background, so transparency buys nothing and costs ~40%.
//   3. The frames are cropped to the union bounding box of opaque pixels across
//      all 61 frames, then downscaled. The union (not per-frame) box is what
//      keeps the robot registered so it does not jitter during the scrub.

import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = "assets/homepage/hero-src";
const OUT_DIR = "public/homepage/hero";

// Regular flat-top hexagon. Landscape subject, so flat-top wastes less of the
// aperture than pointy-top, and a regular hex matches the robot's own
// perforated plates. Height is width * sin(60deg).
const HEX_W = 780;
const HEX_H = Math.round(HEX_W * 0.8660254);

// Robot width as a fraction of hex width. The measured ceiling before opaque
// pixels clip against the hex edge (union silhouette, all 61 frames) is 0.822;
// 0.80 keeps a visible margin inside the aperture.
const ROBOT_FRACTION = 0.8;
const ROBOT_W = Math.round(HEX_W * ROBOT_FRACTION);

// Frame 1 is the poster: it is the LCP element, the reduced-motion still and
// the mobile still, so it is the one frame a user actually looks at. It gets a
// higher quality than the scrub frames, which are on screen for milliseconds
// each while the robot is turning.
const QUALITY_POSTER = 80;
const QUALITY_SCRUB = 62;
const BG = { r: 18, g: 20, b: 24 }; // --color-ink-800 #121418

/** Flat-top hexagon covering the full canvas, as an alpha matte. */
function hexMatte(w, h) {
  const pts = [
    [w * 0.25, 0],
    [w * 0.75, 0],
    [w, h / 2],
    [w * 0.75, h],
    [w * 0.25, h],
    [0, h / 2],
  ];
  return Buffer.from(
    `<svg width="${w}" height="${h}"><polygon points="${pts
      .map((p) => p.join(","))
      .join(" ")}" fill="#fff"/></svg>`,
  );
}

/** Union bounding box of opaque pixels across every frame, at 1/8 scale. */
async function unionBox(files, width, height) {
  const s = 8;
  const w = Math.ceil(width / s);
  const h = Math.ceil(height / s);
  let L = Infinity,
    T = Infinity,
    R = -1,
    B = -1;

  for (const file of files) {
    const { data, info } = await sharp(file)
      .resize(w, h, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * info.channels + 3] > 6) {
          if (x < L) L = x;
          if (x > R) R = x;
          if (y < T) T = y;
          if (y > B) B = y;
        }
      }
    }
  }

  // Scale back up, padding by one sample cell to cover what the 1/8 pass missed.
  const left = Math.max(0, L * s - s);
  const top = Math.max(0, T * s - s);
  return {
    left,
    top,
    width: Math.min(width - left, (R - L + 3) * s),
    height: Math.min(height - top, (B - T + 3) * s),
  };
}

const files = (await readdir(SRC_DIR))
  .filter((f) => /^frame-\d+\.png$/.test(f))
  .sort()
  .map((f) => path.join(SRC_DIR, f));

if (files.length === 0) {
  throw new Error(`No frame-NNN.png files found in ${SRC_DIR}`);
}

const { width, height } = await sharp(files[0]).metadata();
console.log(`${files.length} source frames, ${width}x${height}`);

const crop = await unionBox(files, width, height);
console.log(`union crop: ${crop.width}x${crop.height} at ${crop.left},${crop.top}`);

await mkdir(OUT_DIR, { recursive: true });

const matte = hexMatte(HEX_W, HEX_H);
let total = 0;

for (const [i, file] of files.entries()) {
  const robot = await sharp(file)
    .extract(crop)
    .resize(ROBOT_W, null, { kernel: "lanczos3" })
    .png()
    .toBuffer();
  const { height: robotH } = await sharp(robot).metadata();

  // Composite centred, punch out the hexagon, then flatten onto ink-800 so the
  // file carries no alpha channel at all.
  const composed = await sharp({
    create: {
      width: HEX_W,
      height: HEX_H,
      channels: 4,
      background: { ...BG, alpha: 1 },
    },
  })
    .composite([
      {
        input: robot,
        left: Math.round((HEX_W - ROBOT_W) / 2),
        top: Math.round((HEX_H - robotH) / 2),
      },
    ])
    .png()
    .toBuffer();

  const masked = await sharp(composed)
    .composite([{ input: matte, blend: "dest-in" }])
    .png()
    .toBuffer();

  const out = await sharp({
    create: { width: HEX_W, height: HEX_H, channels: 3, background: BG },
  })
    .composite([{ input: masked }])
    .webp({ quality: i === 0 ? QUALITY_POSTER : QUALITY_SCRUB, effort: 6 })
    .toBuffer();

  const name = `frame-${String(i + 1).padStart(3, "0")}.webp`;
  await writeFile(path.join(OUT_DIR, name), out);
  total += out.length;
}

console.log(
  `wrote ${files.length} frames at ${HEX_W}x${HEX_H} ` +
    `(poster q${QUALITY_POSTER}, scrub q${QUALITY_SCRUB}) — ` +
    `${(total / 1048576).toFixed(2)}MB total, ` +
    `${(total / files.length / 1024).toFixed(1)}KB avg`,
);
