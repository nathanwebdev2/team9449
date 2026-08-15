import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { robotSchema, type Robot } from "./robot-schema";

const ROBOTS_DIR = path.join(process.cwd(), "content", "robots");
const PUBLIC_ROBOTS_DIR = path.join(process.cwd(), "public", "robots");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export interface RobotImages {
  hero: string | null;
  gallery: string[];
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
 * Reads /public/robots/<slug>/ and picks a hero image + gallery,
 * so dropping files in a folder is enough — nobody hand-writes paths.
 */
export function getRobotImages(slug: string): RobotImages {
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
    .map((file) => `/robots/${slug}/${file}`);

  return { hero: `/robots/${slug}/${heroFile}`, gallery };
}
