"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { profile } from "@/data/resume";

/** Local time in Gurugram (Asia/Kolkata). Renders an empty slot on the server to avoid hydration mismatch. */
export function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: profile.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return (
    <span className={clsx("label-mono inline-flex min-w-[9ch] items-center gap-2 text-muted", className)} suppressHydrationWarning>
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint/70 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-mint" />
      </span>
      <span>
        {profile.city.toUpperCase()} {time ?? ""} <span>IST</span>
      </span>
    </span>
  );
}
