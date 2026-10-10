import { SectionHeading } from "@/components/ui/SectionHeading";
import { StackRows } from "./stack/StackRows";

/** Caption under the heading (design copy from the task brief, not a resume fact). */
const INTRO = "The same stack, laid flat.";

/** 04 / Stack — the five resume skill groups as ramp-coloured rows (+ a CSS mini tower on desktop). */
export function Stack() {
  return (
    <section id="stack" data-section="stack" aria-labelledby="stack-title" className="bg-ink py-20 md:py-28 lg:py-36">
      <div className="container-x">
        <SectionHeading id="stack" />
        <p className="text-step-0 mt-4 max-w-[44ch] text-muted md:mt-5">{INTRO}</p>
        <StackRows />
      </div>
    </section>
  );
}
