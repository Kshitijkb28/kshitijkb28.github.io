"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check } from "lucide-react";
import { useUI } from "@/store/ui";

/** Single toast region (role=status). Sits above the mobile tab bar / bottom-right on desktop. */
export function Toast() {
  const toast = useUI((s) => s.toast);
  const hide = useUI((s) => s.hideToast);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(hide, 2200);
    return () => window.clearTimeout(t);
  }, [toast, hide]);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-4 lg:inset-x-auto lg:right-6 lg:justify-end"
      style={{ bottom: "calc(var(--tabbar-space) + 16px)" }}
    >
      <AnimatePresence>
        {toast ? (
          <m.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="card-surface flex max-w-full items-center gap-3 rounded-full py-3 pr-5 pl-4 font-mono text-[0.8rem] text-text"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-mint text-ink">
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="wrap-anywhere">{toast.message}</span>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
