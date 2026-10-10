import clsx from "clsx";
import { sectionMeta } from "@/data/resume";

interface Props {
  id: keyof typeof sectionMeta | string;
  className?: string;
  /** Override the annotation on the right (mono). */
  annotation?: string;
  /** Use "dark" when the section sits on --color-ink-2 (no visual change today, reserved). */
  tone?: "default" | "band";
}

/**
 * Section header: hairline, mono index ("01 / About"), contrast-word title (200 + 800) and a mono annotation.
 * The h2 id is `${id}-title`; the parent <section> should use aria-labelledby with it.
 */
export function SectionHeading({ id, className, annotation }: Props) {
  const meta = sectionMeta[id];
  if (!meta) return null;
  const [light, bold] = meta.title;
  const note = annotation ?? meta.annotation;
  return (
    <header className={clsx("hairline pt-5 md:pt-6", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="label-mono text-muted">
          <span className="text-tangerine">{meta.index}</span>
          <span aria-hidden="true"> / </span>
          <span className="sr-only">— </span>
          {meta.label}
        </p>
        {note ? <p className="label-mono hidden text-muted sm:block">{note}</p> : null}
      </div>
      <h2 id={`${id}-title`} className="font-display text-step-3 mt-5 max-w-[14ch] text-text md:mt-7">
        <span className="font-extralight">{light}</span> <span className="font-extrabold">{bold}</span>
      </h2>
    </header>
  );
}
