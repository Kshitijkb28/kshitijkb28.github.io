"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** Media-query strings shared by every gsap.matchMedia() context. */
export const MQ = {
  desktopFine: "(min-width: 64rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
  coarse: "(pointer: coarse)",
  lg: "(min-width: 64rem)",
  belowLg: "(max-width: 63.99rem)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
