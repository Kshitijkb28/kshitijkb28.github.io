import clsx from "clsx";
import type { ReactNode } from "react";

/** Non-interactive mono tag. 32px tall (36px when `size="md"`). */
export function Chip({ children, className, size = "sm", style }: { children: ReactNode; className?: string; size?: "sm" | "md"; style?: React.CSSProperties }) {
  return (
    <span
      style={style}
      className={clsx(
        "inline-flex items-center rounded-full border border-line bg-ink/40 px-3 font-mono text-[0.72rem] tracking-[0.04em] text-text/90 whitespace-nowrap",
        size === "sm" ? "h-8" : "h-9 text-[0.78rem]",
        className,
      )}
    >
      {children}
    </span>
  );
}
