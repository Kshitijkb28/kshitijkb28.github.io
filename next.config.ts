import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 (GitHub Pages workflow / `npm run build:static`) writes a fully static site to `out/`.
 * Without it the default Next output is used (Vercel / `next start`). The page uses no request-time APIs, so both
 * modes prerender everything. Cache Components is left off: it rejects the `force-static` config the generated
 * icon/OG/robots/sitemap routes need for static export, and offers nothing to a page with no dynamic data.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: "export" as const, images: { unoptimized: true } } : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
