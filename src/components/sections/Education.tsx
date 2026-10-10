"use client";

import { m } from "motion/react";
import type { Variants } from "motion/react";
import { education } from "@/data/resume";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * "05 / Education" — two quiet entries from resume.ts.
 * md+: two side-by-side cards (period on top, score numeral + hairline bar at the bottom).
 * <md: a single-column hairline list (school, degree · field, one mono "period · score" row, then the bar).
 * The whole file is a client module because the entrance animation needs `m.div`;
 * every string still comes from `education` and is server-rendered as static HTML.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

interface Custom {
  i: number;
  reduced: boolean;
}

const entryVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: ({ i, reduced }: Custom) => ({
    opacity: 1,
    y: 0,
    transition: reduced ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: i * 0.1 },
  }),
};

const barVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: ({ i, reduced }: Custom) => ({
    scaleX: 1,
    transition: reduced ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: i * 0.1 + 0.25 },
  }),
};

export function Education() {
  const reduced = useReducedMotion();

  return (
    <section
      id="education"
      data-section="education"
      aria-labelledby="education-title"
      className="container-x py-20 md:py-28 lg:py-36"
    >
      <SectionHeading id="education" />

      <ul role="list" className="mt-10 grid list-none gap-0 p-0 md:mt-14 md:grid-cols-2 md:gap-4">
        {education.map((entry, i) => {
          const custom: Custom = { i, reduced };
          return (
            <m.li
              key={entry.id}
              custom={custom}
              variants={entryVariants}
              initial="hidden"
              whileInView="visible"
              animate={reduced ? "visible" : undefined}
              viewport={{ once: true, amount: 0.25 }}
              className="hairline flex flex-col py-6 transition-colors duration-300 md:card-surface md:rounded-2xl md:p-6 md:hover:border-mint/40"
            >
              {/* Desktop only: period on top of the card. */}
              <p className="label-mono hidden text-muted md:block">{entry.period}</p>

              <h3 className="font-display text-step-1 font-extrabold text-balance text-text md:mt-4">
                {entry.school}
              </h3>
              <p className="text-step-0 mt-1 text-muted">
                {entry.degree} · {entry.field}
              </p>

              <div className="mt-5 md:mt-auto md:pt-8">
                {/* Phone: one mono row "period · score"; desktop: the score numeral alone. */}
                <p className="font-mono text-step--1 text-text md:text-step-1">
                  <span className="md:hidden">{entry.period} · </span>
                  {entry.score}
                </p>
                <div className="mt-2 h-px w-full bg-line md:mt-3" aria-hidden="true">
                  <m.div
                    custom={custom}
                    variants={barVariants}
                    className="h-px origin-left bg-mint"
                    style={{ width: `${entry.scoreValue}%` }}
                  />
                </div>
              </div>
            </m.li>
          );
        })}
      </ul>
    </section>
  );
}
