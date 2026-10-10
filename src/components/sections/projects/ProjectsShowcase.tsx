"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MQ } from "@/lib/gsap";
import { ProjectsCarousel } from "./ProjectsCarousel";
import { ProjectsPinned } from "./ProjectsPinned";

/**
 * Picks the layout. The carousel is the SSR / hydration default (phones are the primary target);
 * once hydrated, ≥1024px + fine pointer + motion-ok gets the pinned horizontal track.
 * `useMediaQuery` is SSR-safe (false on the server and during hydration), so the first client render matches the server HTML.
 */
export function ProjectsShowcase() {
  const desktopFine = useMediaQuery(MQ.desktopFine);
  return desktopFine ? <ProjectsPinned /> : <ProjectsCarousel />;
}
