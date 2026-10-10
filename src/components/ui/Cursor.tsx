"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Custom cursor (dot + lagging ring) for fine pointers only. Native cursor stays visible.
 * Grows over links/buttons; shows a label over [data-cursor="drag"] (the 3D tower).
 */
export function Cursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.42, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.42, ease: "power3.out" });
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      gsap.to([d, r], { opacity: 1, duration: 0.25 });
    };
    const hide = () => {
      shown = false;
      gsap.to([d, r], { opacity: 0, duration: 0.25 });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      show();
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const drag = t?.closest<HTMLElement>('[data-cursor="drag"]');
      const link = t?.closest<HTMLElement>("a, button, [data-cursor]");
      if (drag) {
        r.dataset.state = "drag";
        gsap.to(r, { scale: 2.4, duration: 0.3 });
        if (label.current) label.current.textContent = "drag";
      } else if (link) {
        r.dataset.state = "link";
        gsap.to(r, { scale: 1.7, duration: 0.3 });
        if (label.current) label.current.textContent = "";
      } else {
        r.dataset.state = "";
        gsap.to(r, { scale: 1, duration: 0.3 });
        if (label.current) label.current.textContent = "";
      }
    };
    const onLeave = () => hide();
    const onDown = () => gsap.to(r, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(r, { scale: r.dataset.state === "drag" ? 2.4 : r.dataset.state === "link" ? 1.7 : 1, duration: 0.25 });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
      <div
        ref={dot}
        className="absolute top-0 left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tangerine opacity-0"
      />
      <div
        ref={ring}
        className="absolute top-0 left-0 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-text/60 opacity-0 data-[state=drag]:border-mint data-[state=drag]:bg-mint/10"
      >
        <span ref={label} className="font-mono text-[0.32rem] tracking-[0.08em] text-mint uppercase" />
      </div>
    </div>
  );
}
