import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getRobots } from "@/lib/content/robots";
import { SITE_URL } from "@/lib/site";

const ROBOTS_DIR = path.join(process.cwd(), "content", "robots");

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();

  const robotEntries: MetadataRoute.Sitemap = getRobots().map((robot) => {
    const filePath = path.join(ROBOTS_DIR, `${robot.slug}.mdx`);
    const lastModified = fs.existsSync(filePath)
      ? fs.statSync(filePath).mtime
      : buildDate;

    return {
      url: `${SITE_URL}/robots/${robot.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    };
  });

  return [
    {
      url: SITE_URL,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/robots`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...robotEntries,
    {
      url: `${SITE_URL}/team`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/team/join`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // /impact, /sponsors, /resources are ComingSoon today but are real,
    // permanent URLs — included per spec 0012 §3.2 rather than added later.
    {
      url: `${SITE_URL}/impact`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/sponsors`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
