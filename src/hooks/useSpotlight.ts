"use client";

import { useEffect, useRef } from "react";

/**
 * One delegated pointermove listener on a container writes --mx/--my (px, relative to each .spotlight child)
 * for the desktop radial highlight, and a short pressed state on pointerdown for touch.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const target = (last.target as HTMLElement).closest<HTMLElement>(".spotlight");
      if (!target || !root.contains(target)) return;
      const r = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - r.left}px`);
      target.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(".spotlight");
      if (!target) return;
      const r = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${e.clientX - r.left}px`);
      target.style.setProperty("--my", `${e.clientY - r.top}px`);
      target.dataset.pressed = "true";
      window.setTimeout(() => {
        delete target.dataset.pressed;
      }, 320);
    };
    if (fine) root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerdown", onDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
