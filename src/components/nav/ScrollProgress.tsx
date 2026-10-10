"use client";

import { m, useScroll, useSpring } from "motion/react";

/** 2px tangerine→mint progress bar pinned to the top. Transform-only; hidden under reduced motion. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX, background: "var(--ramp)" }}
      className="motion-reduce:hidden fixed inset-x-0 top-0 z-[65] h-0.5 origin-left"
    />
  );
}
