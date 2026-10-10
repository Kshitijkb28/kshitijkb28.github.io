"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Lenis smooth scrolling for wheel input only (desktop). Touch stays native (syncTouch: false).
 * Driven by gsap.ticker so ScrollTrigger and Lenis share one clock. Not mounted under reduced motion.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduced;
  const ref = useRef<LenisRef>(null);

  useEffect(() => {
    if (!enabled) return;
    const update = (time: number) => ref.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    // ReactLenis creates its instance in its own effect, so it is not on the ref yet: bind as soon as it appears.
    let bound: { off: (ev: "scroll", cb: typeof ScrollTrigger.update) => void } | null = null;
    const poll = window.setInterval(() => {
      const lenis = ref.current?.lenis;
      if (!lenis) return;
      lenis.on("scroll", ScrollTrigger.update);
      bound = lenis;
      window.clearInterval(poll);
    }, 30);
    return () => {
      window.clearInterval(poll);
      gsap.ticker.remove(update);
      bound?.off("scroll", ScrollTrigger.update);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <ReactLenis root ref={ref} options={{ lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false }} />;
}
