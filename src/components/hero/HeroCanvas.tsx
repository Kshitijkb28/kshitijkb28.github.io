"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { Component, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { MoveHorizontal } from "lucide-react";
import { useUI } from "@/store/ui";
import { sceneState } from "@/lib/scene-state";
import { HeroFallback } from "./HeroFallback";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** If the scene throws (context creation failed despite the probe), keep the CSS tower instead of crashing the page. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Drag = { id: number; x: number; y: number; lastX: number; captured: boolean; el: HTMLDivElement | null };

/**
 * Owns the hero canvas slot: CSS fallback → lazy WebGL scene (after idle), cross-fade, and all pointer/keyboard
 * interaction (touch lean, drag-to-spin with a 6px horizontal threshold so vertical pans keep scrolling).
 */
export function HeroCanvas() {
  const tier = useUI((s) => s.tier);
  const webgl = useUI((s) => s.webgl);
  const heroReady = useUI((s) => s.heroReady);
  const heroFailed = useUI((s) => s.heroFailed);
  const setHeroFailed = useUI((s) => s.setHeroFailed);
  const [load, setLoad] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [fallbackGone, setFallbackGone] = useState(false);
  const drag = useRef<Drag>({ id: -1, x: 0, y: 0, lastX: 0, captured: false, el: null });

  // Request the WebGL chunk only after the page has loaded and the browser is idle. On phones the request is
  // additionally held while a scroll gesture is in flight (scrollend / 250 ms quiet), so evaluating three.js,
  // creating the context and baking the environment never land mid-flick; the cap is 2.5 s of idle after load.
  useEffect(() => {
    if (!tier || !webgl) return; // no hardware WebGL (or not probed yet): keep the CSS tower
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return; // data saver: keep the CSS tower
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let idle = 0;
    let timer = 0;
    let settle = 0;
    let done = false;
    let scrolling = false;
    let wanted = false;
    const go = () => {
      if (done) return;
      if (scrolling) {
        wanted = true; // load as soon as the current scroll settles
        return;
      }
      done = true;
      setLoad(true);
    };
    const onSettle = () => {
      window.clearTimeout(settle);
      scrolling = false;
      if (wanted) go();
    };
    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(settle);
      settle = window.setTimeout(onSettle, 250);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(go, { timeout: coarse ? 2500 : 1200 });
      else timer = window.setTimeout(go, coarse ? 1500 : 300);
    };
    if (coarse) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("scrollend", onSettle, { passive: true });
    }
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
      window.clearTimeout(settle);
      window.removeEventListener("load", schedule);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onSettle);
    };
  }, [tier, webgl]);

  // Unmount the CSS tower once the cross-fade to the scene has finished (its infinite bob would otherwise keep
  // animating underneath); bring it back if the scene fails or loses its context.
  const showScene = heroReady && !heroFailed;
  useEffect(() => {
    if (!showScene) {
      const id = window.setTimeout(() => setFallbackGone(false), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setFallbackGone(true), 800);
    return () => window.clearTimeout(id);
  }, [showScene]);

  const poke = () => window.dispatchEvent(new Event("hero:invalidate"));

  const setLean = (el: HTMLElement, clientX: number, clientY: number) => {
    const r = el.getBoundingClientRect();
    sceneState.lean.x = ((clientX - r.left) / r.width) * 2 - 1;
    sceneState.lean.y = -(((clientY - r.top) / r.height) * 2 - 1);
    sceneState.leanActive = true;
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, lastX: e.clientX, captured: false, el };
    sceneState.lastInteraction = performance.now();
    if (e.pointerType === "mouse") {
      // A mouse never needs the pan-y threshold: capture at once so a release outside the slot still ends the drag.
      try {
        el.setPointerCapture(e.pointerId);
        drag.current.captured = true;
      } catch {
        /* best-effort */
      }
    } else {
      setLean(el, e.clientX, e.clientY);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.lastX;
    d.lastX = e.clientX;
    if (!d.captured) {
      const tx = e.clientX - d.x;
      const ty = e.clientY - d.y;
      if (Math.abs(tx) > 6 && Math.abs(tx) > Math.abs(ty)) {
        d.captured = true;
        try {
          d.el?.setPointerCapture(e.pointerId);
        } catch {
          /* capture is best-effort */
        }
        sceneState.dragging = true;
        if (!dragged) setDragged(true);
      } else {
        if (e.pointerType !== "mouse") setLean(e.currentTarget, e.clientX, e.clientY);
        return;
      }
    }
    if (!sceneState.dragging) {
      if (Math.abs(dx) < 1) return; // mouse captured on down: only start the drag on actual horizontal movement
      sceneState.dragging = true;
      if (!dragged) setDragged(true);
    }
    const v = Math.max(-0.25, Math.min(0.25, dx * 0.008));
    sceneState.spin += v;
    sceneState.angularVelocity = v;
    sceneState.lastInteraction = performance.now();
    if (e.pointerType !== "mouse") setLean(e.currentTarget, e.clientX, e.clientY);
    poke();
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    if (e.type === "pointerleave" && d.captured) return; // captured pointers keep reporting until up/cancel
    if (d.captured) {
      try {
        d.el?.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    d.id = -1;
    d.captured = false;
    sceneState.dragging = false;
    if (e.pointerType !== "mouse") sceneState.leanActive = false;
    sceneState.lastInteraction = performance.now();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      sceneState.spin += e.key === "ArrowLeft" ? -0.15 : 0.15;
      sceneState.angularVelocity = 0;
      sceneState.lastInteraction = performance.now();
      if (!dragged) setDragged(true);
      poke();
    }
  };

  const sceneMounted = load && !heroFailed;

  return (
    <div id="hero-canvas" className="relative h-full w-full select-none" data-cursor="drag">
      {fallbackGone ? null : (
        <div
          className={clsx("absolute inset-0 transition-opacity duration-700", showScene ? "opacity-0" : "opacity-100")}
          aria-hidden="true"
        >
          <HeroFallback />
        </div>
      )}
      <div
        role="application"
        tabIndex={sceneMounted ? 0 : -1}
        aria-hidden={sceneMounted ? undefined : true}
        aria-label="Interactive 3D stack. Use left and right arrow keys to rotate."
        aria-roledescription="3D scene"
        className={clsx(
          "absolute inset-0 touch-pan-y rounded-3xl transition-opacity duration-700",
          showScene ? "opacity-100" : "opacity-0",
        )}
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={onKeyDown}
      >
        {sceneMounted ? (
          <SceneBoundary onError={() => setHeroFailed(true)}>
            <HeroScene />
          </SceneBoundary>
        ) : null}
      </div>
      <p
        className={clsx(
          "label-mono pointer-events-none absolute bottom-[4%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-muted transition-opacity duration-500 lg:bottom-[2%]",
          (dragged || !sceneMounted) && "opacity-0",
        )}
        aria-hidden="true"
      >
        <MoveHorizontal size={14} /> drag to spin
      </p>
    </div>
  );
}
