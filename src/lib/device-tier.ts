export type Tier = "low" | "mid" | "high";

export interface TierConfig {
  tier: Tier;
  /** max device pixel ratio for the canvas */
  dpr: number;
  slabs: number;
  edges: boolean;
  shadows: boolean;
  post: boolean;
  antialias: boolean;
  float: boolean;
  grain: boolean;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  low: { tier: "low", dpr: 1, slabs: 12, edges: false, shadows: false, post: false, antialias: false, float: false, grain: false },
  mid: { tier: "mid", dpr: 1.5, slabs: 18, edges: true, shadows: false, post: false, antialias: true, float: true, grain: true },
  high: { tier: "high", dpr: 2, slabs: 24, edges: true, shadows: true, post: true, antialias: true, float: true, grain: true },
};


type NavigatorExtra = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export interface WebGLInfo {
  /** hardware-accelerated WebGL2 is available */
  ok: boolean;
  maxTexture: number;
}

/**
 * Probes for hardware WebGL2. `failIfMajorPerformanceCaveat` makes the browser refuse a context that would run on a
 * software renderer (SwiftShader, llvmpipe, blocklisted GPUs); in that case the site keeps the CSS tower and never
 * downloads three.js — a 5 fps software scene would only burn the main thread.
 */
export function detectWebGL(): WebGLInfo {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) as WebGL2RenderingContext | null;
    if (!gl) return { ok: false, maxTexture: 0 };
    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return { ok: true, maxTexture };
  } catch {
    return { ok: false, maxTexture: 0 };
  }
}

/**
 * Heuristic device tier. Client-only (call from useEffect). No network requests.
 * - iOS masks GPU/memory info, so every coarse-pointer device is treated as "mid".
 * - "low" only for reduced motion, data saver, missing WebGL2 or tiny texture limits.
 */
export function detectTier(webgl?: WebGLInfo): Tier {
  if (typeof window === "undefined") return "low";
  // Manual override for testing on real devices: ?tier=low|mid|high
  try {
    const forced = new URLSearchParams(window.location.search).get("tier");
    if (forced === "low" || forced === "mid" || forced === "high") return forced;
  } catch {
    /* ignore */
  }
  const nav = navigator as NavigatorExtra;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const saveData = Boolean(nav.connection?.saveData);
  const { ok, maxTexture } = webgl ?? detectWebGL();
  if (reduced || saveData || !ok || maxTexture < 4096) return "low";
  if (coarse && !fine) return "mid";
  const mem = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  if (mem <= 4) return "mid";
  if (mem >= 8 && cores >= 6) return "high";
  return "mid";
}
