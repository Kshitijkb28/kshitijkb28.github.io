"use client";

import clsx from "clsx";
import { useUI } from "@/store/ui";

/**
 * Soft radial tangerine glow behind the Contact headline. Pure gradient (no filter: blur),
 * drifts via `animate-blob`; static on the "low" device tier and under reduced motion (globals.css).
 */
export function ContactBlob() {
  const tier = useUI((s) => s.tier);
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute top-[3%] left-[-8%] z-0 aspect-square w-[60vw] max-w-[640px] rounded-full",
        tier !== "low" && "animate-blob",
      )}
      style={{ background: "radial-gradient(circle, rgba(255,107,44,.18), transparent 60%)" }}
    />
  );
}
