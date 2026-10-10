"use client";

import { useRef, type ReactNode } from "react";
import { m, type Variants } from "motion/react";
import { ArrowUpRight, Check, Copy, FileText, Mail, Phone } from "lucide-react";
import { links, profile } from "@/data/resume";
import { Button } from "@/components/ui/Button";
import { useClipboard } from "@/hooks/useClipboard";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useUI } from "@/store/ui";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

const basedIn = `Based in ${profile.location}.`;
const mailto = `mailto:${profile.email}`;

const rows = [links.github, links.linkedin, links.site] as const;

/** Hostname + path hint shown next to a row label (only when it adds information). */
function hrefHint(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const buttonClass = "max-md:min-h-[52px] max-md:w-full max-md:text-base";

interface Props {
  /** The server-rendered `<SectionHeading id="contact" />`. */
  children: ReactNode;
}

/** Heading reveal, "Based in" line, the large email link, the primary actions and the three link rows. */
export function ContactBody({ children }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const showToast = useUI((s) => s.showToast);
  const { copied, copy } = useClipboard(1500);
  const magnetRef = useMagnetic<HTMLSpanElement>();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  useGSAP(
    () => {
      const h2 = scope.current?.querySelector<HTMLElement>("#contact-title");
      const bold = h2?.querySelector<HTMLElement>(".font-extrabold");
      if (!h2 || !bold) return;

      const mm = gsap.matchMedia(scope);
      mm.add({ desktop: MQ.desktopFine, motionOk: MQ.motionOk }, (ctx) => {
        const { desktop, motionOk } = ctx.conditions ?? {};
        if (!motionOk) return; // reduced motion → final state, nothing animates

        if (desktop) {
          // Per-character mask reveal of the bold word, desktop fine pointers only. Split after fonts load.
          let cancelled = false;
          document.fonts.ready.then(() => {
            if (cancelled || !h2.isConnected) return;
            ctx.add(() => {
              // "words,chars": the word wrapper keeps the characters on one line (a bare char split let the
              // browser break "something." mid-word). The split is reverted once the reveal has played so the
              // char masks cannot clip descenders afterwards.
              SplitText.create(bold, {
                type: "words,chars",
                mask: "chars",
                autoSplit: true,
                aria: "none", // aria-label is prohibited on a generic <span>; the split is reverted after the reveal

                onSplit: (self) =>
                  gsap.from(self.chars, {
                    yPercent: 110,
                    duration: 0.9,
                    ease: "power4.out",
                    stagger: 0.035,
                    scrollTrigger: { trigger: h2, start: "top 80%", once: true },
                    onComplete: () => self.revert(),
                  }),
              });
            });
          });
          return () => {
            cancelled = true;
          };
        }

        // Phones / coarse pointers / below lg: a simple fade.
        gsap.from(h2, {
          opacity: 0,
          y: 12,
          duration: 0.7,
          scrollTrigger: { trigger: h2, start: "top 85%", once: true },
        });
      });
    },
    { scope },
  );

  const onCopy = async () => {
    const ok = await copy(profile.email);
    showToast(ok ? `Copied — ${profile.email}` : "Copy failed — select the email above");
  };

  return (
    <div ref={scope}>
      {children}

      <p className="mt-6 text-step-0 text-muted md:mt-8">{basedIn}</p>

      <m.div
        variants={listVariants}
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-10 md:mt-12"
      >
        <m.div variants={itemVariants}>
          <a
            href={mailto}
            className="pressable inline-flex min-h-11 max-w-full items-center py-1 font-display text-step-1 sm:text-step-2 font-extrabold text-text wrap-anywhere decoration-tangerine decoration-2 underline-offset-8 hover:underline active:text-tangerine"
          >
            {profile.email}
          </a>
        </m.div>

        <m.div variants={itemVariants} className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          <span ref={magnetRef} className="inline-block max-md:w-full">
            <Button
              variant="primary"
              onClick={onCopy}
              icon={copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              iconPosition="left"
              className={buttonClass}
            >
              Copy email
            </Button>
          </span>
          <Button variant="outline" href={mailto} icon={<Mail aria-hidden="true" />} iconPosition="left" className={buttonClass}>
            Open mail app
          </Button>
          <Button variant="outline" href={profile.phoneHref} icon={<Phone aria-hidden="true" />} iconPosition="left" className={buttonClass}>
            Call <span className="font-mono">{profile.phone}</span>
          </Button>
          <Button
            variant="outline"
            href={profile.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            icon={<FileText aria-hidden="true" />}
            iconPosition="left"
            className={buttonClass}
          >
            Résumé (PDF)
          </Button>
        </m.div>

        <m.ul variants={listVariants} className="hairline mt-12 divide-y divide-line">
          {rows.map((row) => {
            const hint = hrefHint(row.href);
            return (
              <m.li key={row.href} variants={itemVariants}>
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pressable flex min-h-12 items-center justify-between gap-4 py-3 text-text"
                >
                  <span className="flex min-w-0 items-baseline gap-3">
                    <span className="flip font-display text-[1.1rem] font-semibold xs:text-step-1">
                      <span>{row.label}</span>
                      <span aria-hidden="true">{row.label}</span>
                    </span>
                    {hint !== row.label ? <span className="label-mono hidden truncate text-muted sm:inline">{hint}</span> : null}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-6 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-mint"
                  />
                </a>
              </m.li>
            );
          })}
        </m.ul>
      </m.div>
    </div>
  );
}
