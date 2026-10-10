import { ramp } from "@/data/resume";

/** Linear hex mix: t = 0 → a, t = 1 → b. */
export function mix(a: string, b: string, t: number): string {
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const k = Math.min(1, Math.max(0, t));
  const to2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${to2(ch(a, 0) + (ch(b, 0) - ch(a, 0)) * k)}${to2(ch(a, 1) + (ch(b, 1) - ch(a, 1)) * k)}${to2(ch(a, 2) + (ch(b, 2) - ch(a, 2)) * k)}`;
}

/**
 * Row colour for a `rampIndex` 0..4: tangerine (0) → amber (2) → mint (4),
 * matching the hero tower's top → bottom orientation.
 */
export function rowColour(rampIndex: number): string {
  const t = Math.min(1, Math.max(0, rampIndex / 4));
  return t <= 0.5 ? mix(ramp.tangerine, ramp.amber, t * 2) : mix(ramp.amber, ramp.mint, (t - 0.5) * 2);
}
