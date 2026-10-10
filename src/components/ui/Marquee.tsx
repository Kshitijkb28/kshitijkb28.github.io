import clsx from "clsx";

interface Props {
  items: readonly string[];
  className?: string;
  speed?: "normal" | "slow";
  separator?: string;
}

/** Infinite CSS marquee: duplicated track, transform-only, pauses on hover and under reduced motion. */
export function Marquee({ items, className, speed = "normal", separator = "·" }: Props) {
  const track = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-5 pr-5" aria-hidden={hidden || undefined} aria-label={hidden ? undefined : "Skills"}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-5 font-mono text-[0.8rem] uppercase tracking-[0.08em] text-muted">
          <span>{item}</span>
          <span className="text-tangerine" aria-hidden="true">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={clsx("marquee-wrap w-full overflow-hidden py-4", className)}>
      <div className="marquee" data-speed={speed === "slow" ? "slow" : undefined}>
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
