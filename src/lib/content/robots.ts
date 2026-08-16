import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { robotSchema, type Robot } from "./robot-schema";

const ROBOTS_DIR = path.join(process.cwd(), "content", "robots");
const PUBLIC_ROBOTS_DIR = path.join(process.cwd(), "public", "robots");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export interface RobotImage {
  src: string;
  alt: string;
}

export interface RobotImages {
  hero: RobotImage | null;
  gallery: RobotImage[];
}

/**
 * Hand-written alt text for photos that don't have a good mechanical
 * derivation from their filename alone. Keyed by robot slug, then by
 * filename (as it exists in /public/robots/<slug>/).
 */
const PHOTO_ALT: Record<string, Record<string, string>> = {
  "2026-honeycomb": {
    "01-honeycomb-shooter-drum-closeup.jpg":
      "Low-angle close-up of the striped roller drum and raised black panel on Honeycomb's front end, reflective floor.",
    "02-honeycomb-match-action.jpg":
      "Honeycomb on the competition floor with foam game balls in flight, a referee and crowd behind.",
    "03-honeycomb-hopper-open-match.jpg":
      "Honeycomb mid-match with its front hopper open, balls flying past a referee and spectators.",
    "04-honeycomb-alliance-station-action.jpg":
      "Honeycomb near the blue alliance station wall during a match, balls in the air, referee and crowd behind.",
    "05-honeycomb-scoreboard-and-field.jpg":
      "Wide venue shot of the jumbotron scoreboard reading Qualification 66 of 70, Honeycomb on the field below.",
    "06-honeycomb-internal-mechanism.jpg":
      "Overhead close-up of an open panel on Honeycomb showing chains, rollers, and a NEO motor in the shop.",
    "07-honeycomb-logo-panel-detail.jpg":
      "Close-up of the black side panel with the team's yellow hex bee logo cut into it, wiring visible in the pit.",
    "08-honeycomb-hopper-detail-lit.jpg":
      "Honeycomb tilted on its side with a full hopper of balls, one hand-drawn with a bee face, under colored gym lighting.",
    "09-honeycomb-hopper-detail-gym.jpg":
      "Honeycomb tilted with a full hopper of balls in a dark gym, a soccer net visible in the background.",
    "10-honeycomb-hopper-detail-practice-bumper.jpg":
      "Honeycomb tilted with a full hopper of balls, wearing a teal practice bumper marked 9449, dark gym lighting.",
    "11-honeycomb-hopper-tilted-detail.jpg":
      "Honeycomb tipped at a steep angle on a gym floor, hopper full of balls, dramatic lighting.",
    "12-honeycomb-pit-setup.jpg":
      "The team's pit station with tool cabinets, parts bins, and a Canadian flag backdrop, a second robot chassis nearby.",
    "13-honeycomb-team-celebration.jpg":
      "Team members lifting Honeycomb overhead in celebration, arena sponsor banners visible behind them.",
    "14-honeycomb-impact-award.jpg":
      "Honeycomb on an empty arena floor with the FIRST Impact Award medal, ribbon, and plaque displayed on top.",
  },
};

/**
 * Mechanical fallback for any photo without a curated entry in PHOTO_ALT
 * (e.g. a future robot's photos, before someone writes real captions).
 * Turns "06-honeycomb-internal-mechanism.jpg" into "Honeycomb internal
 * mechanism" — reasonable best effort, not a substitute for real alt text.
 */
function altFromFilename(file: string, robotName: string, index: number): string {
  const base = file.replace(/\.[^.]+$/, "");
  const words = base
    .replace(/^img[_-]?/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\d+\b/g, "")
    .trim();

  if (!words) return `${robotName} photo ${index + 1}`;
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function altFor(slug: string, file: string, robotName: string, index: number): string {
  return PHOTO_ALT[slug]?.[file] ?? altFromFilename(file, robotName, index);
}

export function getRobots(): Robot[] {
  if (!fs.existsSync(ROBOTS_DIR)) return [];

  const files = fs
    .readdirSync(ROBOTS_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

  const robots: Robot[] = [];

  for (const file of files) {
    const filePath = path.join(ROBOTS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const result = robotSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        console.error(
          `[content/robots] ${file}: field "${issue.path.join(".") || "(root)"}" — ${issue.message}`
        );
      }
      continue;
    }

    robots.push(result.data);
  }

  return robots;
}

export function getRobotBySlug(slug: string): Robot | null {
  return getRobots().find((robot) => robot.slug === slug) ?? null;
}

export function getRobotBody(slug: string): string {
  const filePath = path.join(ROBOTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return "";

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  return content.trim();
}

/**
 * Reads /public/robots/<slug>/ and picks a hero image + gallery, so
 * dropping files in a folder is enough — nobody hand-writes paths. Front
 * matter's `heroImage`/`gallery` fields are not consulted here; this is
 * the only mechanism that decides what actually renders (see spec 0011 §2).
 */
export function getRobotImages(slug: string, robotName: string): RobotImages {
  const dir = path.join(PUBLIC_ROBOTS_DIR, slug);
  if (!fs.existsSync(dir)) return { hero: null, gallery: [] };

  const files = fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) return { hero: null, gallery: [] };

  const heroFile =
    files.find((file) => path.parse(file).name.toLowerCase() === "hero") ?? files[0];

  const gallery = files
    .filter((file) => file !== heroFile)
    .map((file, index) => ({
      src: `/robots/${slug}/${file}`,
      alt: altFor(slug, file, robotName, index),
    }));

  return {
    hero: { src: `/robots/${slug}/${heroFile}`, alt: altFor(slug, heroFile, robotName, -1) },
    gallery,
  };
}
