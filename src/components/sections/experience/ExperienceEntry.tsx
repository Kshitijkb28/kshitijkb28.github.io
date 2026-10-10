import { ArrowUpRight } from "lucide-react";
import type { Experience } from "@/data/resume";
import { Chip } from "@/components/ui/Chip";
import { Bullets } from "./Bullets";

/**
 * One role. Phone (<lg): a `card-surface` timeline card hanging off the rail. Desktop (lg+): a 5/7 ledger row —
 * sticky left column (index, company, role, period, tags) beside the bullets. The <li> is the `.spotlight` row
 * (cursor-following glow on desktop, pressed tint on touch via useSpotlight on the parent).
 *
 * Node geometry: `--rail-x` is the rail's left edge inside the list, `--entry-x` the entry's left edge, `--node` the dot size.
 */
export function ExperienceEntry({ entry }: { entry: Experience }) {
  return (
    <li
      data-entry
      className="group/entry spotlight relative rounded-2xl p-4 card-surface transition-colors duration-300 lg:-mx-5 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:border-transparent lg:bg-transparent lg:p-5 lg:shadow-none lg:hover:bg-surface/60"
    >
      {/* Timeline node — sits on the rail; scaled in by GSAP (back.out) once the entry's top passes 60% of the viewport. */}
      <span
        aria-hidden="true"
        data-node
        className="absolute top-[34px] left-[calc(var(--rail-x)_+_0.5px_-_var(--entry-x)_-_var(--node)_/_2)] z-[2] size-[var(--node)] rounded-full bg-tangerine shadow-[0_0_0_4px_var(--color-ink-2)] lg:top-[37px]"
      />

      {/* Left column (sticky on desktop) */}
      <div className="relative lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-14 -left-3 hidden font-display text-[8rem] leading-none font-extrabold text-text/5 select-none lg:block"
        >
          {entry.index}
        </span>

        <h3 className="relative wrap-anywhere">
          <a
            href={entry.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pressable group/link inline-flex min-h-11 items-center gap-1.5 rounded-md font-display text-step-1 font-extrabold text-text lg:gap-2 lg:text-step-2"
          >
            <span data-company>{entry.company}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-[0.8em] shrink-0 text-tangerine transition-transform duration-300 ease-out group-hover/entry:translate-x-[3px] group-hover/entry:-translate-y-[3px] group-hover/link:translate-x-[3px] group-hover/link:-translate-y-[3px]"
            />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h3>

        <p className="relative mt-1 text-step-0 text-text/80 lg:mt-2">{entry.role}</p>

        <p className="relative mt-2 font-mono text-[11px] leading-[1.4] tracking-[0.08em] text-muted uppercase lg:mt-3 lg:text-[0.75rem]">
          <time dateTime={entry.start}>{entry.period}</time>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {entry.location}
        </p>

        <ul className="relative mt-4 flex flex-wrap gap-2 lg:mt-6">
          {entry.tags.map((tag) => (
            <li key={tag}>
              <Chip>{tag}</Chip>
            </li>
          ))}
        </ul>
      </div>

      {/* Right column — the bullets */}
      <div className="relative mt-5 lg:col-span-7 lg:mt-0 lg:pt-2">
        <Bullets items={entry.bullets} />
      </div>
    </li>
  );
}
