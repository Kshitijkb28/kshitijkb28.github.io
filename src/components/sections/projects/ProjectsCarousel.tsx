"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { projects } from "@/data/resume";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useSpotlight } from "@/hooks/useSpotlight";
import { ProjectCard } from "./ProjectCard";

const TOTAL = String(projects.length).padStart(2, "0");

/**
 * Native scroll-snap carousel: phones, tablets, touch laptops and reduced motion at any width.
 * The <ul> is its own horizontal scroller (overflow-x auto, overscroll contained) pulled edge-to-edge
 * inside the container with -mx/px gutters, so the page itself never scrolls horizontally.
 */
export function ProjectsCarousel() {
  const reduced = useReducedMotion();
  const listRef = useSpotlight<HTMLUListElement>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children).filter((el): el is HTMLElement => el instanceof HTMLElement);
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        let best = -1;
        let bestRatio = 0;
        items.forEach((el, i) => {
          const r = ratios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        if (best >= 0) setActive(best);
      },
      { root: list, threshold: [0.6, 1] },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [listRef]);

  const goTo = useCallback(
    (index: number) => {
      const list = listRef.current;
      const item = list?.children[index];
      if (!list || !(item instanceof HTMLElement)) return;
      const pad = parseFloat(getComputedStyle(list).paddingLeft) || 0;
      list.scrollTo({ left: item.offsetLeft - pad, behavior: reduced ? "auto" : "smooth" });
    },
    [listRef, reduced],
  );

  return (
    <div className="mt-10 md:mt-14">
      <p aria-hidden="true" className="label-mono mb-4 text-right text-muted lg:hidden">
        swipe →
      </p>

      <ul
        ref={listRef}
        aria-label="Projects"
        className="no-scrollbar relative -mx-[var(--gutter)] flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)]"
        style={{ overscrollBehaviorX: "contain" }}
      >
        {projects.map((project) => (
          <li key={project.id} className="w-[min(85vw,360px)] shrink-0 snap-start lg:w-[min(85vw,420px)]">
            {/* No per-card entrance: a card clipped by the scroller never intersects the viewport, so it would
                swipe in blank and fade only after the snap. The section heading above already animates in. */}
            <ProjectCard project={project} total={TOTAL} className="h-full" />
          </li>
        ))}
      </ul>

      <div role="group" aria-label="Projects pagination" className="mt-3 flex justify-center gap-1">
        {projects.map((project, i) => {
          const isActive = i === active;
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={isActive ? "true" : undefined}
              className="pressable flex size-11 items-center justify-center rounded-full"
            >
              <span
                aria-hidden="true"
                className={clsx("size-2 rounded-full transition-colors duration-300", isActive ? "bg-tangerine" : "bg-muted/70")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
