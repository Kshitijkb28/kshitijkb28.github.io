import { ramp } from "@/data/resume";

const N = 9;

function hex(c: string) {
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)] as const;
}
function mix(a: string, b: string, t: number) {
  const A = hex(a);
  const B = hex(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}
/** 0 = top (tangerine) … 1 = bottom (mint) — same orientation as the 3D tower. */
export function rampColor(t: number) {
  return t < 0.5 ? mix(ramp.tangerine, ramp.amber, t * 2) : mix(ramp.amber, ramp.mint, (t - 0.5) * 2);
}

/**
 * Pure-CSS stand-in for the 3D tower: paints at first contentful paint, while the WebGL chunk loads,
 * when WebGL is unavailable, and on context loss. Bobs gently (static under reduced motion via the global CSS rule).
 */
export function HeroFallback() {
  const slabs = Array.from({ length: N }, (_, i) => rampColor(1 - i / (N - 1)));
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="animate-bob relative h-[72%] w-[70%] max-w-[420px]" style={{ perspective: "900px" }}>
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", transform: "rotateX(64deg) rotateZ(-26deg)" }}
        >
          {slabs.map((c, i) => (
            <div
              key={i}
              className="absolute inset-x-[16%] top-[32%] h-[36%] rounded-xl border"
              style={{
                background: `${c}2e`,
                borderColor: `${c}aa`,
                boxShadow: `0 0 24px ${c}22, inset 0 0 12px ${c}22`,
                transform: `translateZ(${(i - (N - 1) / 2) * 26}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
