import type { MetadataRoute } from "next";
import { SITE } from "@/data/resume";

/** Required for `output: "export"` (GitHub Pages): this route is generated at build time. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, lastModified: new Date("2026-10-10"), changeFrequency: "monthly", priority: 1 }];
}
