import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"a"> {
  label: string;
  href: string;
}

/** Text link whose label flips up to a mint copy on hover/focus (pointer-fine only; no-op on touch). */
export function FlipLink({ label, href, className, ...rest }: Props) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={clsx("inline-flex min-h-11 items-center font-body text-text", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <span className="flip">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
    </a>
  );
}
