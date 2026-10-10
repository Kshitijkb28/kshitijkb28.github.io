import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/resume";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

interface SkinStyles {
  card: string;
  meta: string;
  blurb: string;
  marker: string;
  letter: string;
  /** `!` (important) overrides: Tailwind v4 orders same-property utilities alphabetically, so plain classes would lose to the primitives' defaults. */
  chip?: string;
  button?: string;
}

const coloured: Omit<SkinStyles, "card"> = {
  meta: "text-ink",
  blurb: "text-ink/80",
  marker: "bg-ink",
  letter: "opacity-[0.18]",
  chip: "border-ink/20! bg-ink/10! text-ink!",
  button: "border-ink/30! text-ink! hover:border-ink/50! hover:bg-ink/10!",
};

const skins: Record<Project["skin"], SkinStyles> = {
  surface: {
    card: "card-surface text-text",
    meta: "text-muted",
    blurb: "text-muted",
    marker: "bg-tangerine",
    letter: "opacity-[0.14]",
  },
  tangerine: { card: "bg-tangerine text-ink", ...coloured },
  mint: { card: "bg-mint text-ink", ...coloured },
};

interface Props {
  project: Project;
  /** Zero-padded count, e.g. "03". */
  total: string;
  className?: string;
}

/**
 * Shared project card (desktop track + mobile carousel). The card itself is not a link;
 * the only interactive element is the "Visit" button, so nested-link semantics stay clean.
 */
export function ProjectCard({ project, total, className }: Props) {
  const skin = skins[project.skin];
  const titleId = `project-${project.id}-title`;
  return (
    <article
      aria-labelledby={titleId}
      className={clsx("spotlight pressable relative flex flex-col overflow-hidden rounded-3xl p-6 md:p-8", skin.card, className)}
    >
      {/* Generative art: the giant outlined initial, clipped by the card. Painted beneath the content (content wrapper is `relative`). */}
      <span
        aria-hidden="true"
        data-letter=""
        className={clsx(
          "pointer-events-none absolute right-0 bottom-0 translate-x-[12%] translate-y-[18%] font-display leading-none font-extrabold select-none",
          skin.letter,
        )}
        style={{
          fontSize: "clamp(10rem, 34vw, 22rem)",
          // 1px outline in the card's current colour. The global `text-stroke` utility sets `color: transparent`,
          // which also makes its `currentColor` stroke transparent, so the outline is set here with a transparent fill instead.
          WebkitTextStroke: "1px currentColor",
          WebkitTextFillColor: "transparent",
        }}
      >
        {project.initial}
      </span>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <p className={clsx("label-mono flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", skin.meta)}>
          <span>
            {project.index}
            <span aria-hidden="true"> / </span>
            <span className="sr-only">of </span>
            {total}
          </span>
          <span>{project.period}</span>
        </p>

        <h3 id={titleId} className="font-display text-step-2 wrap-anywhere mt-4 font-extrabold">
          {project.name}
        </h3>
        <p className={clsx("text-step-0 wrap-anywhere mt-3", skin.blurb)}>{project.blurb}</p>

        <ul className="text-step-0 mt-5 space-y-2.5">
          {project.bullets.map((bullet) => (
            <li key={bullet} className="wrap-anywhere flex gap-3">
              <span aria-hidden="true" className={clsx("mt-[0.62em] size-1.5 shrink-0 rounded-full", skin.marker)} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Built with">
          {project.tags.map((tag) => (
            <li key={tag} className="flex">
              <Chip className={skin.chip}>{tag}</Chip>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Button
            href={project.href}
            variant="outline"
            size="lg"
            icon={<ArrowUpRight aria-hidden="true" />}
            className={clsx("wrap-anywhere w-full text-center whitespace-normal! sm:w-auto", skin.button)}
            aria-label={`Visit ${project.domain} (opens in a new tab)`}
          >
            Visit {project.domain}
          </Button>
        </div>
      </div>
    </article>
  );
}
