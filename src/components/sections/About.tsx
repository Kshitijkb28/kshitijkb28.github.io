import { ArrowUpRight } from "lucide-react";
import { allSkills, profile, stats } from "@/data/resume";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Monogram } from "@/components/ui/Monogram";
import { Marquee } from "@/components/ui/Marquee";
import { AboutReveal } from "./about/AboutReveal";
import { WordFill } from "./about/WordFill";
import { StatNumber } from "./about/StatNumber";
import { FactsList } from "./about/FactsList";

const nowLabel = `${profile.now.role} @ ${profile.now.company}`;

/** Portrait tile: the ringed Monogram (96 on phones, 160 on lg+), or a plain <img> if a photo is ever configured. */
function Portrait() {
  if (profile.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- brief asks for a plain <img> with explicit dimensions
      <img
        src={profile.photo}
        alt={`Portrait of ${profile.name}`}
        width={160}
        height={160}
        className="size-24 shrink-0 rounded-[27px] object-cover lg:size-40 lg:rounded-[45px]"
      />
    );
  }
  return (
    <>
      <span className="lg:hidden">
        <Monogram size={96} ring />
      </span>
      <span className="hidden lg:block">
        <Monogram size={160} ring />
      </span>
    </>
  );
}

/** 01 / About — server component; animated parts live in ./about/* client components. */
export function About() {
  return (
    <section id="about" data-section="about" aria-labelledby="about-title" className="relative bg-ink py-20 md:py-28 lg:py-36">
      <div className="container-x">
        <AboutReveal>
          <SectionHeading id="about" />

          {/* Below lg both columns are `display: contents`, so the four blocks become direct grid items and are
              ordered portrait → paragraphs → stats → facts. On lg+ they are real columns (5/12 sticky + 7/12). */}
          <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:mt-20 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
            {/* Left column */}
            <div className="contents lg:col-span-5 lg:block lg:sticky lg:top-28 lg:self-start">
              <div className="order-1 flex items-center gap-5 lg:flex-col lg:items-start lg:gap-8">
                <Portrait />
                <div className="min-w-0">
                  <p className="label-mono text-muted">{profile.now.label}</p>
                  <a
                    href={profile.now.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable mt-1 inline-flex min-h-11 max-w-full items-center gap-1.5 font-display text-step-0 font-semibold text-text"
                  >
                    <span className="flip wrap-anywhere">
                      <span>{nowLabel}</span>
                      <span aria-hidden="true">{nowLabel}</span>
                    </span>
                    <ArrowUpRight size={18} strokeWidth={2.25} className="shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <ul className="order-3 grid grid-cols-3 gap-2 lg:mt-10 lg:gap-3">
                {stats.map((stat) => (
                  <li key={stat.label} className="card-surface min-w-0 rounded-2xl px-2.5 py-3 xs:p-4 lg:rounded-3xl lg:p-5">
                    <p className="font-display text-step-2 font-extrabold leading-none tracking-[-0.03em] text-text">
                      <StatNumber value={stat.value} />
                      {stat.suffix ? <span className="text-[0.5em] font-bold text-muted">{stat.suffix}</span> : null}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase leading-tight tracking-[0.04em] text-text lg:text-xs lg:tracking-[0.08em]">
                      {stat.label}
                    </p>
                    {"caption" in stat ? <p className="text-step--1 wrap-anywhere mt-1 text-muted">{stat.caption}</p> : null}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column */}
            <div className="contents lg:col-span-7 lg:block">
              <div className="order-2 space-y-6 lg:space-y-8">
                <WordFill text={profile.summary[0]} className="font-body text-step-1 max-w-[32ch] text-text" />
                <p className="text-step-0 max-w-[60ch] text-muted">{profile.summary[1]}</p>
                <p className="text-step-0 max-w-[60ch] text-text">{profile.nowLine}</p>
              </div>

              <div className="order-4 lg:mt-14">
                <FactsList />
              </div>
            </div>
          </div>
        </AboutReveal>
      </div>

      {/* Full-bleed skills strip (outside container-x; Marquee goes static under reduced motion). */}
      <div className="hairline mt-16 md:mt-20 lg:mt-28">
        <Marquee items={allSkills} />
      </div>
    </section>
  );
}
