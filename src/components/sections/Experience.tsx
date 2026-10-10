import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceLedger } from "./experience/ExperienceLedger";

/**
 * "02 / Experience" — the inverted band (bg-ink-2 full-bleed wrapper with a hairline).
 * Static shell is a Server Component; the ledger/timeline (spotlight, GSAP rail, entrances) is a client child.
 */
export function Experience() {
  return (
    <div className="bg-ink-2 hairline">
      <section
        id="experience"
        data-section="experience"
        aria-labelledby="experience-title"
        className="container-x py-20 md:py-28 lg:py-36"
      >
        <SectionHeading id="experience" />
        <ExperienceLedger />
      </section>
    </div>
  );
}
