"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Whole-section entrance: a subtle fade/rise once the block scrolls into view. Final state under reduced motion. */
export function AboutReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
