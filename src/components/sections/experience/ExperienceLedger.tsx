"use client";

import { useRef } from "react";
import { experience } from "@/data/resume";
import { useSpotlight } from "@/hooks/useSpotlight";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { ExperienceEntry } from "./ExperienceEntry";

/**
 * The list of roles with a vertical rail on the far left (1px --line) and a tangerine progress overlay that is
 * scrubbed (scaleY 0→1, origin top) across the entries. Nodes pop in per entry. Company names reveal with a
 * SplitText line mask on desktop (fine pointer, motion OK) and a plain fade on phones. Reduced motion: final state.
 *
 * Phone: rail at 16px, 8px nodes, entries padded 36px. Desktop: rail at 0, 10px nodes, entries start 40px in
 * (the <li> pulls 20px back with -mx-5 and pads 20px, so the glow/hover shape has room around the content).
 */
export function ExperienceLedger() {
  const spotRef = useSpotlight<HTMLDivElement>();
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = listRef.current;
      if (!root) return;
      const progress = root.querySelector<HTMLElement>("[data-rail-progress]");
      const entries = Array.from(root.querySelectorAll<HTMLElement>("[data-entry]"));
      const mm = gsap.matchMedia();

      mm.add({ motionOk: MQ.motionOk, reduced: MQ.reduced, desktopFine: MQ.desktopFine }, (ctx) => {
        const c = ctx.conditions ?? {};

        if (c.reduced || !c.motionOk) {
          // Final states, no animation.
          if (progress) gsap.set(progress, { scaleY: 1, transformOrigin: "50% 0" });
          return;
        }

        // Rail progress: draws as the entries scroll past the 60% line (Lenis feeds ScrollTrigger.update, so it stays smooth).
        if (progress) {
          gsap.fromTo(
            progress,
            { scaleY: 0, transformOrigin: "50% 0" },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top 60%", end: "bottom 60%", scrub: 0.4 },
            },
          );
        }

        // Nodes: scale in once when each entry's top passes 60% of the viewport.
        entries.forEach((entry) => {
          const node = entry.querySelector<HTMLElement>("[data-node]");
          if (!node) return;
          gsap.from(node, {
            scale: 0,
            transformOrigin: "50% 50%",
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: { trigger: entry, start: "top 60%", once: true },
          });
        });

        // Company names.
        const names = entries
          .map((entry) => entry.querySelector<HTMLElement>("[data-company]"))
          .filter((el): el is HTMLElement => el !== null);

        if (c.desktopFine) {
          let splits: SplitText[] = [];
          let dead = false;
          document.fonts.ready.then(() => {
            if (dead) return;
            ctx.add(() => {
              splits = names.map((el) =>
                SplitText.create(el, {
                  type: "lines",
                  mask: "lines",
                  autoSplit: true,
                  onSplit: (self) =>
                    gsap.from(self.lines, {
                      yPercent: 110,
                      duration: 0.9,
                      ease: "power4.out",
                      stagger: 0.08,
                      scrollTrigger: { trigger: el, start: "top 85%", once: true },
                    }),
                }),
              );
            });
          });
          return () => {
            dead = true;
            splits.forEach((s) => s.revert());
            splits = [];
          };
        }

        // Phones / coarse pointers: plain fade.
        names.forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: listRef },
  );

  return (
    <div ref={spotRef} className="mt-12 md:mt-16 lg:mt-20">
      <div
        ref={listRef}
        className="relative [--entry-x:36px] [--node:8px] [--rail-x:16px] lg:[--entry-x:20px] lg:[--node:10px] lg:[--rail-x:0px]"
      >
        {/* Rail: 1px --line with the scrubbed tangerine overlay. */}
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-[var(--rail-x)] z-[1] w-px bg-line">
          <span
            data-rail-progress
            className="absolute inset-0 block bg-tangerine"
            style={{ transform: "scaleY(0)", transformOrigin: "50% 0" }}
          />
        </div>

        <ol className="space-y-8 pl-[var(--entry-x)] lg:space-y-20 lg:pl-10">
          {experience.map((entry) => (
            <ExperienceEntry key={entry.id} entry={entry} />
          ))}
        </ol>
      </div>
    </div>
  );
}
