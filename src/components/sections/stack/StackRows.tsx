"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { m } from "motion/react";
import { skills } from "@/data/resume";
import { Chip } from "@/components/ui/Chip";
import { useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { rowColour } from "./ramp";

type Mode = "motion" | "gsap" | "static";

const rows = skills.map((group) => ({ ...group, colour: rowColour(group.rampIndex) }));

const EASE = [0.22, 1, 0.36, 1] as const;
const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, staggerChildren: 0.03, delayChildren: 0.1 } },
};
const chipVariants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

/** Row shell: `m.li` with a whileInView entrance in "motion" mode, a plain `li` otherwise (GSAP or final state). */
function RowShell({ mode, className, style, children, ...hover }: {
  mode: Mode;
  className: string;
  style: CSSProperties;
  children: ReactNode;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  if (mode === "motion") {
    return (
      <m.li
        {...hover}
        data-row=""
        className={className}
        style={style}
        variants={rowVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        {children}
      </m.li>
    );
  }
  return (
    <li {...hover} data-row="" className={className} style={style}>
      {children}
    </li>
  );
}

function ChipShell({ mode, children }: { mode: Mode; children: ReactNode }) {
  if (mode === "motion") {
    return (
      <m.li data-chip="" variants={chipVariants}>
        {children}
      </m.li>
    );
  }
  return <li data-chip="">{children}</li>;
}

export function StackRows() {
  const reduced = useReducedMotion();
  const desktopFine = useMediaQuery(MQ.desktopFine);
  // Server + hydration: "motion" (both hooks return false). Switching mode remounts the list (key) so
  // the two animation systems never touch the same element.
  const mode: Mode = reduced ? "static" : desktopFine ? "gsap" : "motion";

  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      if (mode !== "gsap" || !listRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.desktopFine, () => {
        const list = listRef.current;
        if (!list) return;
        const rowEls = gsap.utils.toArray<HTMLElement>("[data-row]", list);
        const chipEls = gsap.utils.toArray<HTMLElement>("[data-chip]", list);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: list, start: "top 80%", once: true },
        });
        tl.from(rowEls, {
          x: (i: number) => (i % 2 === 0 ? -60 : 60),
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
        }).from(
          chipEls,
          { opacity: 0, y: 6, duration: 0.4, ease: "power3.out", stagger: 0.015 },
          "<0.2",
        );
      });
    },
    { scope: listRef, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[1fr_200px]">
      <ul ref={listRef} key={mode} className="flex min-w-0 flex-col gap-3" aria-label="Skill groups">
        {rows.map((row, i) => (
          <RowShell
            key={row.id}
            mode={mode}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            style={{ "--row": row.colour, borderLeftColor: row.colour, borderLeftWidth: 3 } as CSSProperties}
            className="card-surface grid min-w-0 grid-cols-1 gap-3 rounded-2xl p-4 transition-shadow duration-300 md:grid-cols-[11rem_1fr] md:items-center md:gap-4 md:p-5 hover:[box-shadow:inset_3px_0_12px_-6px_var(--row),inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <p className="label-mono flex items-center gap-2.5 text-text">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: row.colour }} />
              {row.label}
            </p>
            <ul className="flex min-w-0 flex-wrap gap-2" aria-label={`${row.label} tools`}>
              {row.items.map((item) => (
                <ChipShell key={item} mode={mode}>
                  <Chip
                    size="md"
                    className="transition-[translate,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--row)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--row)_12%,transparent)]"
                  >
                    {item}
                  </Chip>
                </ChipShell>
              ))}
            </ul>
          </RowShell>
        ))}
      </ul>

      {/* Desktop-only CSS mini tower: mirrors the hero's top (tangerine) → bottom (mint) order. */}
      <div aria-hidden="true" className="hidden items-center justify-center lg:flex">
        <div
          data-active={active ?? undefined}
          className="relative h-40 w-[200px]"
          style={{ transform: "perspective(600px) rotateX(55deg) rotateZ(-20deg)", transformStyle: "preserve-3d" }}
        >
          {rows.map((row, i) => {
            const isActive = active === i;
            const dimmed = active !== null && !isActive;
            return (
              <div
                key={row.id}
                className={clsx(
                  "absolute inset-x-0 top-0 h-4 rounded-md transition-[scale,opacity,filter] duration-300 ease-out",
                  isActive && "scale-110 brightness-125",
                  dimmed && "opacity-40 brightness-75",
                )}
                style={{
                  background: row.colour,
                  transform: `translateY(${i * 34}px)`,
                  boxShadow: `0 6px 0 -1px color-mix(in srgb, ${row.colour} 55%, #0A0B0E)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
