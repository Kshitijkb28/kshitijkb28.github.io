import clsx from "clsx";
import { profile } from "@/data/resume";

interface Props {
  /** pixel size of the tile */
  size?: number;
  className?: string;
  /** rotating ramp ring (About tile) vs. plain mark (nav/footer) */
  ring?: boolean;
}

/** The "KB" mark. With `ring`, a conic tangerine→amber→mint ring rotates slowly around it. */
export function Monogram({ size = 44, className, ring = false }: Props) {
  const radius = Math.round(size * 0.28);
  return (
    <span
      className={clsx("relative inline-flex shrink-0 items-center justify-center overflow-hidden", className)}
      style={{ width: size, height: size, borderRadius: radius }}
      aria-hidden="true"
    >
      {ring ? (
        <span
          className="animate-spin-slow absolute inset-[-50%]"
          style={{ background: "conic-gradient(from 0deg, #ff6b2c, #ffb86b, #7ef2c5, #ff6b2c)" }}
        />
      ) : (
        <span className="absolute inset-0 bg-line" />
      )}
      <span
        className="font-display absolute inset-[2px] flex items-center justify-center bg-surface font-extrabold tracking-[-0.06em] text-text"
        style={{ borderRadius: Math.max(radius - 2, 2), fontSize: size * 0.42, lineHeight: 1 }}
      >
        {profile.initials}
      </span>
    </span>
  );
}
