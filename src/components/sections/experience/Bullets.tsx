"use client";

import { m } from "motion/react";
import { useIsDesktop, useReducedMotion } from "@/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Resume bullets with a 6px tangerine square marker. All bullets are always rendered (nothing clamped).
 * Entrance: staggered `m.li` once in view — x -12 → 0 on desktop, y 12 → 0 on phones; final state under reduced motion.
 * The list is keyed by (desktop, reduced) so the `initial` offset matches the breakpoint after hydration.
 */
export function Bullets({ items }: { items: readonly string[] }) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const hidden = desktop ? { opacity: 0, x: -12, y: 0 } : { opacity: 0, x: 0, y: 12 };

  return (
    <ul key={`${desktop}-${reduced}`} className="space-y-2 lg:space-y-3">
      {items.map((text, i) => (
        <m.li
          key={text}
          initial={reduced ? false : hidden}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : i * 0.07 }}
          className="relative pl-5 text-step-0 leading-relaxed text-text/90 wrap-anywhere before:absolute before:top-[0.7em] before:left-0 before:size-1.5 before:bg-tangerine before:content-['']"
        >
          {text}
        </m.li>
      ))}
    </ul>
  );
}
