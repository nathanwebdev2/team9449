import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No Hive-platform routes exist yet. Once one does, add it here —
        // e.g. `disallow: ["/thehive"]` — no other restructure needed.
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
