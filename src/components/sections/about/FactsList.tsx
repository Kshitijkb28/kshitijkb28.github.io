"use client";

import { m } from "motion/react";
import { facts } from "@/data/resume";
import { useReducedMotion } from "@/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The four label/value facts. Each row's top hairline draws in (scaleX 0 → 1 from the left) and its text fades in,
 * staggered row by row the first time it scrolls into view. Reduced motion renders the final state immediately.
 */
export function FactsList() {
  const reduced = useReducedMotion();

  return (
    <dl className="border-b border-line">
      {facts.map((fact, i) => {
        const delay = reduced ? 0 : i * 0.08;
        const line = {
          hidden: { scaleX: 0 },
          show: { scaleX: 1, transition: reduced ? { duration: 0 } : { duration: 0.8, ease: EASE, delay } },
        };
        const fade = {
          hidden: { opacity: 0, y: 8 },
          show: { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: delay + 0.12 } },
        };
        return (
          <m.div
            key={fact.label}
            className="relative grid grid-cols-1 gap-x-4 gap-y-1 py-4 xs:grid-cols-[7rem_1fr] lg:grid-cols-[9rem_1fr] lg:py-5"
            initial="hidden"
            whileInView="show"
            animate={reduced ? "show" : undefined}
            viewport={{ once: true, amount: 0.5 }}
          >
            <m.span aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" variants={line} />
            <m.dt className="label-mono self-center text-muted" variants={fade}>
              {fact.label}
            </m.dt>
            <m.dd className="text-step-0 wrap-anywhere text-text" variants={fade}>
              {fact.value}
            </m.dd>
          </m.div>
        );
      })}
    </dl>
  );
}
