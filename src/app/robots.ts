import type { MetadataRoute } from "next";
import { SITE } from "@/data/resume";

/** Required for `output: "export"` (GitHub Pages): this route is generated at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
