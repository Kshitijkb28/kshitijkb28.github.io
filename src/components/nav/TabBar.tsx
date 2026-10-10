"use client";

import { useCallback, type MouseEvent } from "react";
import clsx from "clsx";
import { m } from "motion/react";
import { useLenis } from "lenis/react";
import { Briefcase, Home, Layers, Mail, User, type LucideIcon } from "lucide-react";
import { tabForSection, tabs } from "@/data/resume";
import { useUI } from "@/store/ui";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useReducedMotion } from "@/hooks/useMediaQuery";

type TabIcon = (typeof tabs)[number]["icon"];

const ICONS: Record<TabIcon, LucideIcon> = {
  home: Home,
  user: User,
  briefcase: Briefcase,
  layers: Layers,
  mail: Mail,
};

const SPRING = { type: "spring", stiffness: 420, damping: 36 } as const;
const INSTANT = { duration: 0 } as const;
const SLOT = 100 / tabs.length; // each tab is flex-1 → exactly 1/5 of the bar

/** Floating bottom tab bar for phones/tablets (below lg). Always visible; never auto-hides. */
export function TabBar() {
  const activeSection = useUI((s) => s.activeSection);
  const reduced = useReducedMotion();
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const activeTab = tabForSection[activeSection] ?? "top";
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTab),
  );
  const pillTransition = reduced ? INSTANT : SPRING;

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

  return (
    <nav
      aria-label="Sections"
      className="card-surface fixed inset-x-3 z-50 mx-auto h-14 max-w-[420px] rounded-full lg:hidden"
      style={{
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        backgroundColor: "color-mix(in srgb, var(--color-surface) 95%, transparent)",
      }}
    >
      <ul className="relative flex h-full items-stretch">
        {/*
         * One pill, slid with a transform (no layoutId: the app's LazyMotion loads
         * domAnimation, which has no layout projection). The track is exactly one
         * tab wide, so `x = index * 100%` lands on the active slot without measuring.
         */}
        <m.span
          aria-hidden="true"
          initial={false}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={pillTransition}
          className="pointer-events-none absolute inset-y-0 left-0 will-change-transform"
          style={{ width: `${SLOT}%` }}
        >
          <span className="absolute inset-1 rounded-full bg-tangerine" />
        </m.span>

        {tabs.map((tab) => {
          const Icon = ICONS[tab.icon];
          const active = activeTab === tab.id;
          return (
            <li key={tab.id} className="relative min-w-0 flex-1">
              <a
                href={`#${tab.id}`}
                aria-current={active ? "page" : undefined}
                onClick={(e) => go(e, tab.id)}
                className={clsx(
                  "pressable relative z-10 flex h-full min-h-11 w-full flex-col items-center justify-center gap-1 rounded-full transition-colors duration-200",
                  active ? "text-ink" : "text-muted",
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.25 : 2} aria-hidden="true" />
                <span className="font-mono text-[10px] leading-none tracking-[0.04em] whitespace-nowrap uppercase">{tab.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
