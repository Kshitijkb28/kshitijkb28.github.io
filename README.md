# Kshitij Bhardwaj — portfolio

Single-page developer portfolio with a real-time 3D hero ("Soft Stack": a tower of glowing slabs that leans, whips and spins under the pointer), scroll choreography and a mobile-first layout.

## Stack

Next.js 16 (App Router, Cache Components, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · three.js + React Three Fiber + drei (+ postprocessing on capable desktops) · GSAP (ScrollTrigger, SplitText) · motion · Lenis (desktop wheel only) · zustand.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static prerender of / plus generated favicon, OG image, robots and sitemap
npm run start
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin (used for canonical/Open Graph URLs and the sitemap); it falls back to `https://kshitijkb28.github.io`.

## Editing content

Everything on the page comes from `src/data/resume.ts` (profile, links, skills, experience, projects, education, section titles, nav). Edit that file only — nothing else contains copy. The résumé PDF served by the "Résumé (PDF)" links lives at `public/Kshitij-Bhardwaj-Resume.pdf`. To show a portrait instead of the "KB" monogram in About, drop an image in `public/` and set `profile.photo` to its path.

## How the 3D hero adapts

`src/lib/device-tier.ts` picks a tier on the client (never on the server):

| tier | when | what renders |
|---|---|---|
| low | reduced motion, data saver, no WebGL2 | 12 slabs, dpr 1, no edges/post, static pose under reduced motion |
| mid | every touch device, modest laptops | 18 slabs, dpr ≤ 1.5, edges, no post |
| high | desktop with ≥ 8 GB / ≥ 6 cores | 24 slabs, dpr ≤ 2, edges, contact shadow, bloom |

A frame-time guard and drei's `PerformanceMonitor` demote at runtime if frames drop. Append `?tier=low|mid|high` to the URL to force a tier while testing. The WebGL chunk loads after the page is idle; a CSS tower paints first and on any WebGL failure. Touch: vertical drags scroll the page, horizontal drags spin the tower; arrow keys rotate it when focused.

## Project layout

```
src/app            layout (fonts, metadata, JSON-LD), page, globals.css (design tokens), icon / opengraph-image / robots / sitemap
src/components/hero       Hero section, entrance choreography, canvas wrapper, CSS fallback, HeroScene, SoftStack, Effects
src/components/nav        TopNav (desktop bar + mobile top row), TabBar (mobile bottom pill), ScrollProgress, Clock
src/components/sections   About, Experience, Projects, Stack, Education, Contact, Footer (+ subfolders)
src/components/ui         SectionHeading, Button, Chip, FlipLink, Marquee, Monogram, Toast, Grain, Cursor, BrandIcons
src/components/providers  LazyMotion + tier detection, Lenis ↔ GSAP ticker wiring
src/lib                   device-tier, scene-state (60 Hz values), gsap registration, OG font loader
src/hooks · src/store     SSR-safe media queries, clipboard, magnetic, spotlight, scroll-to, zustand UI store
```

## Deploy

GitHub Pages (live at https://kshitijkb28.github.io): every push to `main` runs `.github/workflows/deploy.yml`, which builds the static export (`npm run build:static` → `out/`) and publishes it with `actions/deploy-pages`. The repository's Pages source must be "GitHub Actions". `public/.nojekyll` keeps the `_next/` folder servable.

Vercel also works with zero configuration (`npm run build`, default output).
