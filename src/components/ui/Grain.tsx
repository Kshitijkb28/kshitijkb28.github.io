"use client";

import { useUI } from "@/store/ui";

/** Film-grain overlay. Animated + blended on fine-pointer desktops (CSS), static on phones, absent on the low tier. */
export function Grain() {
  const tier = useUI((s) => s.tier);
  if (tier === "low") return null;
  return <div className="grain" aria-hidden="true" />;
}
