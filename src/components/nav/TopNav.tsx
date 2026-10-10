"use client";

import clsx from "clsx";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { m } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Mail } from "lucide-react";
import { links, navLinks, profile } from "@/data/resume";
import { useUI } from "@/store/ui";
import { useActiveSectionObserver } from "@/hooks/useActiveSection";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Monogram } from "@/components/ui/Monogram";
import { FlipLink } from "@/components/ui/FlipLink";
import { Button } from "@/components/ui/Button";
import { Clock } from "@/components/nav/Clock";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

const SCROLLED_AT = 80;

const HOME_LABEL = `KB — ${profile.name}, back to top`;
const SPRING = { type: "spring", stiffness: 420, damping: 36 } as const;
const INSTANT = { duration: 0 } as const;
const DOT_SIZE = 6;

/**
 * Site header: desktop top bar (lg+) and the transparent mobile top row (below lg).
 * This is the single call site of `useActiveSectionObserver()`.
 */
export function TopNav() {
  useActiveSectionObserver();
  const activeSection = useUI((s) => s.activeSection);
  const reduced = useReducedMotion();
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const magnetRef = useMagnetic<HTMLSpanElement>();
  const activeIndex = navLinks.findIndex((l) => l.id === activeSection);
  // Dot centre (px, relative to the <ul>) — set from a measurement, not from a scroll/pointer handler.
  const [dotX, setDotX] = useState(0);

  // Transparent at the top; after 80px the desktop bar gets its blurred backdrop.
  // The scroll listener only touches a data attribute via the ref (never React state).
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let scrolled = false;
    const update = () => {
      const next = window.scrollY > SCROLLED_AT;
      if (next === scrolled) return;
      scrolled = next;
      if (next) bar.dataset.scrolled = "";
      else delete bar.dataset.scrolled;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // The dot is a single element slid with a transform: the app's LazyMotion loads
  // domAnimation (no layout projection), so `layoutId` would not animate here.
  // Measure the active <li> whenever the section changes or the list resizes (fonts).
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || activeIndex < 0) return;
    const measure = () => {
      const li = itemRefs.current[activeSection];
      if (!li) return;
      setDotX(Math.round(li.offsetLeft + li.offsetWidth / 2));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [activeSection, activeIndex]);

  const go = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      if (id === "top" && !document.getElementById("top")) {
        // The hero may not expose an element with id="top"; fall back to the page top.
        const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (lenis && !instant) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
      } else {
        scrollTo(id);
      }
      window.history.replaceState(null, "", id === "top" ? window.location.pathname + window.location.search : `#${id}`);
    },
    [lenis, scrollTo],
  );

  const dotTransition = reduced
    ? { x: INSTANT, opacity: INSTANT }
    : { x: SPRING, opacity: { duration: 0.2 } };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* ---------- Desktop bar (lg+) ---------- */}
      <div
        ref={barRef}
        className="pointer-events-auto hidden h-(--nav-h) border-b border-transparent transition-[background-color,border-color] duration-300 ease-out data-scrolled:border-line data-scrolled:bg-ink/70 data-scrolled:backdrop-blur-md lg:block"
      >
        <nav aria-label="Primary" className="container-x flex h-full items-center gap-6">
          <a
            href="#top"
            aria-label={HOME_LABEL}
            onClick={(e) => go(e, "top")}
            className="pressable inline-flex size-11 shrink-0 items-center justify-center rounded-xl"
          >
            <Monogram size={36} />
          </a>

          <ul ref={listRef} className="relative flex items-center gap-1">
            {navLinks.map((link) => {
              const active = activeSection === link.id;
              return (
                <li
                  key={link.id}
                  ref={(el) => {
                    itemRefs.current[link.id] = el;
                  }}
                  className="relative"
                >
                  <FlipLink
                    label={link.label}
                    href={`#${link.id}`}
                    onClick={(e) => go(e, link.id)}
                    aria-current={active ? "location" : undefined}
                    className="px-3 text-[0.95rem]"
                  />
                </li>
              );
            })}
            {/* Active-link dot: always mounted, hidden while no nav link is active (hero/top). */}
            <m.span
              aria-hidden="true"
              initial={false}
              animate={{ x: dotX - DOT_SIZE / 2, opacity: activeIndex >= 0 ? 1 : 0 }}
              transition={dotTransition}
              className="pointer-events-none absolute bottom-0.5 left-0 size-1.5 rounded-full bg-tangerine will-change-transform"
            />
          </ul>

          <div className="ml-auto flex items-center gap-1">
            <Clock className="mr-3" />
            <a
              href={links.github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={links.github.label}
              className="pressable inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-text"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={links.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={links.linkedin.label}
              className="pressable inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-text"
            >
              <LinkedinIcon size={18} />
            </a>
            <span ref={magnetRef} className="ml-2 inline-block will-change-transform">
              <Button href={`mailto:${profile.email}`} variant="primary" size="md" icon={<ArrowUpRight aria-hidden="true" />}>
                Email
              </Button>
            </span>
          </div>
        </nav>
      </div>

      {/* ---------- Mobile top row (below lg) ---------- */}
      <div
        className={clsx(
          "pointer-events-none bg-linear-to-b from-ink/80 to-transparent pb-4 transition-[translate,opacity] duration-300 ease-out lg:hidden",
          activeSection !== "top" && "-translate-y-full opacity-0",
        )}
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
        aria-hidden={activeSection !== "top" ? true : undefined}
        inert={activeSection !== "top" ? true : undefined}
      >
        <nav aria-label="Primary" className="container-x flex h-14 items-center justify-between">
          <a
            href="#top"
            aria-label={HOME_LABEL}
            onClick={(e) => go(e, "top")}
            className="pressable pointer-events-auto inline-flex size-11 items-center justify-center rounded-xl"
          >
            <Monogram size={36} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label={`Email ${profile.firstName}`}
            className="card-surface pressable pointer-events-auto inline-flex size-11 items-center justify-center rounded-full text-text"
          >
            <Mail size={20} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
