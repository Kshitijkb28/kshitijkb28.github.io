"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Smooth-scrolls to an element id: Lenis when it is active (desktop), native scrollIntoView otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const offset = window.matchMedia("(min-width: 64rem)").matches ? -72 : -12;
      if (lenis && !reduced) {
        lenis.scrollTo(el, { offset, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
      // Like a native #anchor jump, start sequential focus at the target so keyboard users continue from there.
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    },
    [lenis],
  );
}
