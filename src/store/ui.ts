import { create } from "zustand";
import type { Tier } from "@/lib/device-tier";

interface UIState {
  /** null until detected on the client (SSR renders the "low" markup) */
  tier: Tier | null;
  setTier: (t: Tier) => void;
  /** hardware WebGL available (null until probed); false keeps the CSS tower and skips the three.js chunk */
  webgl: boolean | null;
  setWebGL: (v: boolean) => void;
  demote: () => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
  toast: { id: number; message: string } | null;
  showToast: (message: string) => void;
  hideToast: () => void;
  /** the hero section is within the range where the canvas should render */
  heroVisible: boolean;
  setHeroVisible: (v: boolean) => void;
  /** the 3D hero has rendered its first frame */
  heroReady: boolean;
  setHeroReady: (v: boolean) => void;
  /** the WebGL scene failed (no context / context lost) → keep the CSS fallback */
  heroFailed: boolean;
  setHeroFailed: (v: boolean) => void;
}

let toastId = 0;

export const useUI = create<UIState>((set, get) => ({
  tier: null,
  setTier: (tier) => set({ tier }),
  webgl: null,
  setWebGL: (webgl) => set({ webgl }),
  demote: () => {
    const t = get().tier;
    if (t === "high") set({ tier: "mid" });
    else if (t === "mid") set({ tier: "low" });
  },
  activeSection: "top",
  setActiveSection: (activeSection) => {
    if (get().activeSection !== activeSection) set({ activeSection });
  },
  toast: null,
  showToast: (message) => set({ toast: { id: ++toastId, message } }),
  hideToast: () => set({ toast: null }),
  heroVisible: true,
  setHeroVisible: (heroVisible) => {
    if (get().heroVisible !== heroVisible) set({ heroVisible });
  },
  heroReady: false,
  setHeroReady: (heroReady) => set({ heroReady }),
  heroFailed: false,
  setHeroFailed: (heroFailed) => set({ heroFailed }),
}));
