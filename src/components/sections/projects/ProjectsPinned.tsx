"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "@/data/resume";
import { gsap, useGSAP, MQ, type ScrollTrigger } from "@/lib/gsap";
import { useSpotlight } from "@/hooks/useSpotlight";
import { ProjectCard } from "./ProjectCard";

const TOTAL = String(projects.length).padStart(2, "0");
const MAX_TILT = 6; // degrees
const LETTER_SHIFT = 16; // px
const DRAG_THRESHOLD = 6; // px before a mouse press becomes a drag (clicks on "Visit" still work)
const DRAG_RATIO = 1.15; // page scroll per pixel dragged

/**
 * Desktop (≥1024px, fine pointer, motion ok): the section pins and the three cards scrub horizontally.
 * The scrub is driven by the page scroll, so besides the wheel it also answers horizontal trackpad swipes,
 * click-and-drag on the track, the prev/next arrows and keyboard focus — all of which just move the page
 * to the matching scroll position (through Lenis when it is active).
 * All tweens/triggers live inside gsap.matchMedia(MQ.desktopFine) within useGSAP, so Strict Mode double-mount,
 * unmount and a breakpoint change all revert cleanly (gsap.matchMedia restores inline styles).
 */
export function ProjectsPinned() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const spotRef = useSpotlight<HTMLDivElement>();
  const stRef = useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  /** Moves the page (Lenis when present) so the scrub lands on the given scroll position. */
  const scrollPageTo = (y: number, mode: "smooth" | "follow" | "instant") => {
    const l = lenisRef.current;
    if (l) {
      l.scrollTo(y, mode === "instant" ? { immediate: true } : mode === "follow" ? { lerp: 0.35 } : { duration: 0.9 });
    } else {
      window.scrollTo({ top: y, behavior: mode === "smooth" ? "smooth" : "auto" });
    }
  };
  const currentScroll = () => lenisRef.current?.targetScroll ?? window.scrollY;
  const positionFor = (index: number) => {
    const st = stRef.current;
    if (!st) return null;
    const i = gsap.utils.clamp(0, projects.length - 1, index);
    return st.start + (st.end - st.start) * (i / Math.max(1, projects.length - 1));
  };
  const currentIndex = () => {
    const st = stRef.current;
    return st ? Math.round(st.progress * (projects.length - 1)) : 0;
  };
  const step = (dir: -1 | 1) => {
    const y = positionFor(currentIndex() + dir);
    if (y !== null) scrollPageTo(y, "smooth");
  };

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.desktopFine, () => {
        const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64;
        let lastIndex = -1;

        // Horizontal scrub. The travel includes the track's own left offset (container gutter / centring)
        // so the last card is never left clipped on very wide viewports.
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth + pin.getBoundingClientRect().left - window.innerWidth + 96),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            start: () => `top ${Math.max(navH + 24, Math.round((window.innerHeight - pin.offsetHeight) / 2))}`,
            end: () => "+=" + (track.scrollWidth - window.innerWidth + 200),
            onUpdate: (self) => {
              const i = Math.min(projects.length - 1, Math.round(self.progress * (projects.length - 1)));
              if (i === lastIndex || !counterRef.current) return;
              lastIndex = i;
              counterRef.current.textContent = `${projects[i].index} — ${TOTAL}`;
            },
          },
        });

        const cards = gsap.utils.toArray<HTMLElement>("[data-tilt]", track);

        // Keyboard: the track is translated by the scrub and `html { overflow-x: clip }` stops the browser's own
        // focus-scrolling from revealing clipped cards, so when focus lands inside a card we drive the trigger to
        // that card's scroll position. `st.scroll()` goes through the scroller proxy, so it stays in sync with Lenis.
        const st = tween.scrollTrigger;
        stRef.current = st ?? null;
        const onFocus = (e: FocusEvent) => {
          if (!st) return;
          const card = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-tilt]");
          const i = card ? cards.indexOf(card) : -1;
          if (i < 0) return;
          st.scroll(st.start + (st.end - st.start) * (i / Math.max(1, projects.length - 1)));
        };
        track.addEventListener("focusin", onFocus);

        // Horizontal trackpad swipe / shift-wheel while the section is on screen → page scroll (= card slide).
        const inView = () => {
          const r = pin.getBoundingClientRect();
          return r.bottom > 0 && r.top < window.innerHeight;
        };
        const onWheel = (e: WheelEvent) => {
          if (!st || Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !inView()) return;
          e.preventDefault();
          const target = gsap.utils.clamp(st.start, st.end, currentScroll() + e.deltaX);
          scrollPageTo(target, "follow");
        };
        pin.addEventListener("wheel", onWheel, { passive: false });

        // Click-and-drag on the track (mouse). A press that moves less than the threshold is still a click.
        let dragId = -1;
        let dragStartX = 0;
        let dragStartScroll = 0;
        let dragging = false;
        let suppressClick = false;
        const onDown = (e: PointerEvent) => {
          if (e.pointerType !== "mouse" || e.button !== 0 || !st) return;
          dragId = e.pointerId;
          dragStartX = e.clientX;
          dragStartScroll = currentScroll();
          dragging = false;
        };
        const onDragMove = (e: PointerEvent) => {
          if (e.pointerId !== dragId || !st) return;
          const dx = dragStartX - e.clientX;
          if (!dragging) {
            if (Math.abs(dx) < DRAG_THRESHOLD) return;
            dragging = true;
            track.classList.add("cursor-grabbing");
            try {
              track.setPointerCapture(e.pointerId);
            } catch {
              /* best-effort */
            }
          }
          scrollPageTo(gsap.utils.clamp(st.start, st.end, dragStartScroll + dx * DRAG_RATIO), "instant");
        };
        const onDragEnd = (e: PointerEvent) => {
          if (e.pointerId !== dragId) return;
          dragId = -1;
          if (!dragging) return;
          dragging = false;
          track.classList.remove("cursor-grabbing");
          try {
            track.releasePointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
          suppressClick = true;
          window.setTimeout(() => {
            suppressClick = false;
          }, 0);
        };
        const onClickCapture = (e: MouseEvent) => {
          if (!suppressClick) return;
          e.preventDefault();
          e.stopPropagation();
        };
        track.addEventListener("pointerdown", onDown);
        track.addEventListener("pointermove", onDragMove);
        track.addEventListener("pointerup", onDragEnd);
        track.addEventListener("pointercancel", onDragEnd);
        track.addEventListener("click", onClickCapture, true);

        // Per-card pointer tilt (≤ 6°) + letter parallax (≤ 16px). 60 Hz values go through quickTo, never React state.
        const detach = cards.map((card) => {
          gsap.set(card, { transformPerspective: 1200 });
          const rotX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
          const rotY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
          const letter = card.querySelector<HTMLElement>("[data-letter]");
          const letX = letter ? gsap.quickTo(letter, "x", { duration: 0.6, ease: "power3.out" }) : null;
          const letY = letter ? gsap.quickTo(letter, "y", { duration: 0.6, ease: "power3.out" }) : null;

          const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
            const dy = (e.clientY - r.top) / r.height - 0.5;
            rotY(dx * MAX_TILT * 2);
            rotX(-dy * MAX_TILT * 2);
            letX?.(dx * LETTER_SHIFT * 2);
            letY?.(dy * LETTER_SHIFT * 2);
          };
          const onLeave = () => {
            rotX(0);
            rotY(0);
            letX?.(0);
            letY?.(0);
          };
          card.addEventListener("pointermove", onMove, { passive: true });
          card.addEventListener("pointerleave", onLeave);
          return () => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          };
        });

        return () => {
          stRef.current = null;
          track.removeEventListener("focusin", onFocus);
          pin.removeEventListener("wheel", onWheel);
          track.removeEventListener("pointerdown", onDown);
          track.removeEventListener("pointermove", onDragMove);
          track.removeEventListener("pointerup", onDragEnd);
          track.removeEventListener("pointercancel", onDragEnd);
          track.removeEventListener("click", onClickCapture, true);
          track.classList.remove("cursor-grabbing");
          detach.forEach((fn) => fn());
        };
      });
    },
    { scope: pinRef },
  );

  return (
    <div ref={pinRef} className="relative mt-10 md:mt-14">
      <div className="mb-8 flex items-center justify-between gap-6">
        <p className="label-mono text-muted" aria-hidden="true">
          Scroll, swipe or drag
        </p>
        <div className="flex items-center gap-4">
          <p ref={counterRef} aria-hidden="true" className="label-mono text-muted tabular-nums">
            {projects[0].index} — {TOTAL}
          </p>
          <div className="flex items-center gap-2" role="group" aria-label="Projects navigation">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous project"
              className="pressable flex size-11 items-center justify-center rounded-full border border-line text-text hover:border-muted hover:bg-surface"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next project"
              className="pressable flex size-11 items-center justify-center rounded-full border border-line text-text hover:border-muted hover:bg-surface"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div ref={spotRef}>
        <div ref={trackRef} className="flex cursor-grab select-none items-stretch gap-8 will-change-transform">
          {projects.map((project) => (
            <div key={project.id} data-tilt="" className="w-[60vw] max-w-[840px] shrink-0">
              <ProjectCard project={project} total={TOTAL} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
