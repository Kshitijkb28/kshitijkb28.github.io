"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

interface Props {
  value: number;
  className?: string;
}

/**
 * Renders the final number in SSR HTML; once JS runs (and motion is allowed) it resets to 0 and counts up
 * the first time the tile enters the viewport. Reduced motion: the final number stays as-is.
 */
export function StatNumber({ value, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const counter = { v: 0 };
        el.textContent = "0";
        const tween = gsap.to(counter, {
          v: value,
          duration: 1.2,
          ease: "power3.out",
          snap: { v: 1 },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return () => {
          tween.kill();
          el.textContent = String(value);
        };
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
