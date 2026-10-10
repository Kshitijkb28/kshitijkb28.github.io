import clsx from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "pressable inline-flex items-center justify-center gap-2 rounded-full font-body font-medium whitespace-nowrap select-none " +
  "focus-visible:outline-2 focus-visible:outline-mint focus-visible:outline-offset-3 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-tangerine text-ink hover:bg-[#ff8247] active:bg-[#f25f22]",
  outline: "border border-line bg-transparent text-text hover:border-muted hover:bg-surface",
  ghost: "text-text hover:text-mint underline-offset-4 hover:underline px-2",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-12 px-6 text-base lg:min-h-12",
};

type AnchorProps = ComponentPropsWithoutRef<"a"> & { href: string };
type ButtonProps = ComponentPropsWithoutRef<"button"> & { href?: undefined };

export type ButtonLikeProps = (AnchorProps | ButtonProps) & {
  variant?: Variant;
  size?: Size;
  /** Full width (used for stacked CTAs on phones). */
  block?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
};

/** Polymorphic button: renders <a> when `href` is given, otherwise <button>. 44px+ tall by default. */
export function Button({ variant = "primary", size = "md", block, icon, iconPosition = "right", className, children, ...rest }: ButtonLikeProps) {
  const cls = clsx(base, variants[variant], sizes[size], block && "w-full", className);
  const content = (
    <>
      {icon && iconPosition === "left" ? <span className="inline-flex shrink-0 [&>svg]:size-[1.1em]">{icon}</span> : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? <span className="inline-flex shrink-0 [&>svg]:size-[1.1em]">{icon}</span> : null}
    </>
  );
  if ("href" in rest && rest.href) {
    const { href, ...a } = rest as AnchorProps;
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...a}
      >
        {content}
      </a>
    );
  }
  const b = rest as ButtonProps;
  return (
    <button type="button" className={cls} {...b}>
      {content}
    </button>
  );
}
