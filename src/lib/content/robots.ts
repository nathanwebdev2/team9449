import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { robotSchema, type Robot } from "./robot-schema";

const ROBOTS_DIR = path.join(process.cwd(), "content", "robots");

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
