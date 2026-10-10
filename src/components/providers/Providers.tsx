"use client";

import { useEffect, type ReactNode } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import { detectTier, detectWebGL } from "@/lib/device-tier";
import { useUI } from "@/store/ui";
import { ScrollTrigger } from "@/lib/gsap";
import { SmoothScroll } from "./SmoothScroll";

function TierInit() {
  const setTier = useUI((s) => s.setTier);
  const setWebGL = useUI((s) => s.setWebGL);
  useEffect(() => {
    // Probing WebGL creates a context; keep it off the hydration task.
    const probe = window.setTimeout(() => {
      const webgl = detectWebGL();
      setWebGL(webgl.ok);
      setTier(detectTier(webgl));
    }, 0);
    // Fonts change line breaks and heights → recompute every ScrollTrigger once they are in.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      window.clearTimeout(probe);
    };
  }, [setTier, setWebGL]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <TierInit />
      <SmoothScroll />
      {children}
    </LazyMotion>
  );
}
