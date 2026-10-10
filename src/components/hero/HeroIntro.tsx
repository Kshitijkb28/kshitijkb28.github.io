"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sceneState } from "@/lib/scene-state";
import { useUI } from "@/store/ui";
import { useScrollTo } from "@/hooks/useScrollTo";

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Hero choreography (client): headline SplitText reveal gated on fonts (300 ms cap), scroll progress → sceneState,
 * canvas fade/pause as the hero leaves, text parallax, mouse lean over the whole hero, and in-page anchor scrolling.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();
  const scrollToRef = useRef(scrollTo);
  useEffect(() => {
    scrollToRef.current = scrollTo;
  }, [scrollTo]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const section = root.closest("section") ?? root;
      const h1 = root.querySelector<HTMLElement>("h1");
      const canvasSlot = root.querySelector<HTMLElement>("[data-hero-canvas-slot]");
      const textBlock = root.querySelector<HTMLElement>("[data-hero-text]");
      const secondary = root.querySelectorAll<HTMLElement>("[data-hero-secondary]");
      const reduced = window.matchMedia(MQ.reduced).matches;
      const html = document.documentElement;

      // ---- Entrance: the H1 reveal is pure CSS (see globals.css / Hero.tsx). Here only the secondary
      // elements settle in. `cancelled` guards the async callback against React Strict Mode's double mount.
      let cancelled = false;
      let cap = 0;
      const ensureRevealed = () => {
        if (html.getAttribute("data-js") === "pending") html.setAttribute("data-js", "ready");
      };
      if (reduced || !h1) {
        ensureRevealed();
      } else {
        let ran = false;
        const run = () => {
          if (cancelled || ran) return;
          ran = true;
          gsap.fromTo(
            secondary,
            { y: 10, opacity: 0.35 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.15, overwrite: true, clearProps: "opacity,transform" },
          );
          ensureRevealed();
        };
        cap = window.setTimeout(run, 300);
        document.fonts?.ready.then(() => {
          window.clearTimeout(cap);
          run();
        });
      }

      // ---- Scroll: progress → sceneState; fade + pause the canvas as the hero leaves ----
      const applyProgress = (p: number) => {
        sceneState.heroProgress = p;
        if (canvasSlot) canvasSlot.style.opacity = String(1 - smoothstep(0.55, 0.95, p));
        const visible = p < 0.97;
        if (visible !== sceneState.visible) {
          sceneState.visible = visible;
          useUI.getState().setHeroVisible(visible);
          if (canvasSlot) canvasSlot.style.visibility = visible ? "visible" : "hidden";
        }
      };
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => applyProgress(self.progress),
        // a pre-scrolled load (restored scroll, /#projects) never fires onUpdate — sync on every refresh too
        onRefresh: (self) => applyProgress(self.progress),
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        if (!textBlock) return;
        const desktop = window.matchMedia(MQ.lg).matches;
        gsap.to(textBlock, {
          yPercent: desktop ? -12 : -6,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      });

      // ---- Mouse lean over the whole hero (fine pointers only; touch lean lives in HeroCanvas) ----
      const fine = window.matchMedia(MQ.finePointer).matches;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || sceneState.dragging) return;
        const r = section.getBoundingClientRect();
        sceneState.lean.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        sceneState.lean.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        sceneState.leanActive = true;
      };
      const onLeave = () => {
        sceneState.leanActive = false;
      };
      if (fine && !reduced) {
        section.addEventListener("pointermove", onMove, { passive: true });
        section.addEventListener("pointerleave", onLeave);
      }

      // ---- In-page anchors (Lenis on desktop, native on touch) ----
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href")!.slice(1);
        if (!id || !document.getElementById(id)) return;
        e.preventDefault();
        scrollToRef.current(id);
      };
      root.addEventListener("click", onClick);

      return () => {
        cancelled = true;
        window.clearTimeout(cap);
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("click", onClick);
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
