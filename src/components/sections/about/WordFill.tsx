"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

interface Props {
  text: string;
  className?: string;
}

/**
 * "Word-fill" scrub reveal: each word fades from 0.15 → 1 as the paragraph scrolls from 80% → 30% of the viewport.
 * Split happens after fonts are ready (inside the gsap context), `autoSplit` re-splits on resize and re-runs the tween
 * returned from `onSplit`. Reduced motion: no split, the paragraph stays at full opacity (its SSR state).
 */
export function WordFill({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motionOk: MQ.motionOk, coarse: MQ.coarse }, (ctx) => {
        const conditions = (ctx.conditions ?? {}) as { motionOk?: boolean; coarse?: boolean };
        if (!conditions.motionOk) return; // reduced motion → nothing to do, text is already fully visible
        const isTouch = Boolean(conditions.coarse);
        let split: SplitText | null = null;
        let cancelled = false;

        document.fonts.ready.then(() => {
          if (cancelled || ctx.isReverted) return;
          // ctx.add() runs the function inside this context so the tween is reverted with it.
          ctx.add(() => {
            split = SplitText.create(el, {
              type: "words",
              autoSplit: true,
              // SplitText's default adds aria-label to the <p>, which ARIA prohibits on paragraphs; word spans read fine.
              aria: "none",
              onSplit: (self) =>
                gsap.fromTo(
                  self.words,
                  { opacity: 0.15 },
                  {
                    opacity: 1,
                    stagger: 0.04,
                    ease: "none",
                    scrollTrigger: { trigger: el, start: "top 80%", end: "top 30%", scrub: 0.6, once: isTouch },
                  },
                ),
            });
          });
        });

        return () => {
          cancelled = true;
          split?.revert();
          split = null;
        };
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
