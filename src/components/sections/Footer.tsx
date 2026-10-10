"use client";

import { m } from "motion/react";
import { ArrowUp } from "lucide-react";
import { profile, links, SITE } from "@/data/resume";
import { Monogram } from "@/components/ui/Monogram";
import { FlipLink } from "@/components/ui/FlipLink";
import { Button } from "@/components/ui/Button";
import { Clock } from "@/components/nav/Clock";
import { useLenis } from "lenis/react";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/** True for this build (Next.js + React Three Fiber hero + GSAP). */
const BUILT_WITH = "Built with Next.js, React Three Fiber and GSAP";

const footerLinks = [
  { label: links.github.label, href: links.github.href },
  { label: links.linkedin.label, href: links.linkedin.href },
  { label: links.site.label, href: links.site.href },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;

/** Scrolls back to the hero (`id="top"`). Round icon button on lg+, full-width outline button below. */
function BackToTop() {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const onClick = () => {
    // All DOM/window reads stay inside the handler (hydration-safe).
    if (document.getElementById("top")) {
      scrollTo("top");
      return;
    }
    // The hero may not expose an element with id="top"; fall back to the page top (same as TabBar/TopNav).
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis && !instant) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
  };
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Back to top"
        className="pressable group hidden size-11 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-muted hover:bg-surface lg:inline-flex"
      >
        <ArrowUp
          aria-hidden="true"
          size={18}
          className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:-rotate-45 motion-reduce:transition-none motion-reduce:group-hover:translate-none motion-reduce:group-hover:rotate-none"
        />
      </button>
      <Button
        variant="outline"
        size="lg"
        block
        onClick={onClick}
        aria-label="Back to top"
        icon={<ArrowUp aria-hidden="true" />}
        className="lg:hidden"
      >
        Back to top
      </Button>
    </>
  );
}

export function Footer() {
  const reduced = useReducedMotion();
  return (
    <footer className="hairline bg-ink">
      <m.div
        className="container-x py-12 pb-6 text-center md:py-16 lg:text-left"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          {/* Left: identity + copyright */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <Monogram size={36} />
            <p className="wrap-anywhere text-text">
              <span className="font-display font-extrabold">{profile.name}</span>
              <span className="text-muted">
                {" "}
                — {profile.role}, {profile.city}
              </span>
            </p>
            <div className="label-mono flex flex-col gap-1 text-muted">
              <p>
                © {SITE.year} {profile.name}
              </p>
              <p>{BUILT_WITH}</p>
            </div>
          </div>

          {/* Middle: links */}
          <nav aria-label="Footer links">
            <ul className="flex flex-col items-stretch gap-1 lg:items-start">
              {footerLinks.map((l) => (
                <li key={l.href} className="flex justify-center lg:justify-start">
                  <FlipLink
                    label={l.label}
                    href={l.href}
                    className="pressable wrap-anywhere w-full justify-center px-2 lg:w-auto lg:justify-start lg:px-0"
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: clock + back to top */}
          <div className="flex flex-col items-center gap-5 lg:items-end">
            <Clock />
            <BackToTop />
          </div>
        </div>
      </m.div>
    </footer>
  );
}
