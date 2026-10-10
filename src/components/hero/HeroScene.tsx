"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { TIER_CONFIG } from "@/lib/device-tier";
import { useUI } from "@/store/ui";
import { sceneState } from "@/lib/scene-state";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { SoftStack } from "./SoftStack";

const Effects = dynamic(() => import("./Effects"), { ssr: false });

/** Procedural studio reflections (three's RoomEnvironment through PMREM) — no HDR download, no drei. */
function StudioEnvironment() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.28;
    return () => {
      scene.environment = null;
      env.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [get]);
  return null;
}

/** Flags the store once the first frame has rendered (drives the fallback → scene cross-fade). */
function ReadySignal() {
  const setHeroReady = useUI((s) => s.setHeroReady);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    sceneState.ready = true;
    window.setTimeout(() => setHeroReady(true), 0);
  });
  return null;
}

/**
 * Frame-time guard:
 * - 4 consecutive frames over 120 ms (a GPU that cannot keep up at all) demote immediately;
 * - a rolling 60-frame average over 45 ms (below ~22 fps) for two consecutive windows demotes as well.
 * Single stalls (shader compile, GC) are clamped so one long frame cannot trip it, and a steady 30 fps
 * (iOS Low Power Mode / battery saver rAF cap, 33 ms frames) stays well under the threshold.
 */
function FrameGuard({ onDemote }: { onDemote: () => void }) {
  const acc = useRef({ sum: 0, n: 0, badWindows: 0, cooldown: 2, slow: 0 });
  useFrame((_, delta) => {
    const a = acc.current;
    if (a.cooldown > 0) {
      a.cooldown -= delta;
      return;
    }
    if (delta > 0.12) {
      a.slow += 1;
      if (a.slow >= 4) {
        a.slow = 0;
        a.cooldown = 4;
        onDemote();
        return;
      }
    } else {
      a.slow = 0;
    }
    a.sum += Math.min(delta, 0.1);
    a.n += 1;
    if (a.n < 60) return;
    const avg = a.sum / a.n;
    a.sum = 0;
    a.n = 0;
    if (avg > 0.045) {
      a.badWindows += 1;
      if (a.badWindows >= 2) {
        a.badWindows = 0;
        a.cooldown = 6;
        onDemote();
      }
    } else {
      a.badWindows = 0;
    }
  });
  return null;
}

/**
 * Under reduced motion the loop is on demand: kick a few frames so the environment map and first pose render,
 * and render a frame whenever the wrapper reports input (arrow keys / drag) via the "hero:invalidate" event.
 */
function DemandKick() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const ids = [0, 150, 500, 1200].map((t) => window.setTimeout(() => invalidate(), t));
    const onInput = () => invalidate();
    window.addEventListener("hero:invalidate", onInput);
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("hero:invalidate", onInput);
    };
  }, [invalidate]);
  return null;
}

function CameraRig() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export default function HeroScene() {
  const tier = useUI((s) => s.tier) ?? "low";
  const demote = useUI((s) => s.demote);
  const setHeroFailed = useUI((s) => s.setHeroFailed);
  const heroVisible = useUI((s) => s.heroVisible);
  const reduced = useReducedMotion();
  const cfg = TIER_CONFIG[tier];
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const frameloop = reduced ? "demand" : heroVisible && !tabHidden ? "always" : "never";

  return (
    <Canvas
      dpr={[1, cfg.dpr]}
      frameloop={frameloop}
      gl={{
        antialias: cfg.antialias,
        powerPreference: "high-performance",
        stencil: false,
        alpha: true,
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 1.2, 7.4], fov: 32, near: 0.1, far: 50 }}
      style={{ touchAction: "pan-y", pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a0b0e", 0);
        // iOS discards WebGL contexts under memory pressure; three re-initialises on restore, so the canvas stays
        // mounted and only the CSS fallback is shown in between.
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          setHeroFailed(true);
        });
        gl.domElement.addEventListener("webglcontextrestored", () => setHeroFailed(false));
      }}
    >
      <CameraRig />
      <StudioEnvironment />
      <ambientLight intensity={0.12} />
      <directionalLight position={[2, 4, 3]} intensity={0.7} />
      <pointLight color="#ff6b2c" intensity={5} distance={14} decay={2} position={[3.5, 3, 3]} />
      <pointLight color="#7ef2c5" intensity={4} distance={14} decay={2} position={[-4, 0.5, -1.5]} />
      <Suspense fallback={null}>
        <SoftStack cfg={cfg} reduced={reduced} />
        {cfg.post && !reduced ? <Effects /> : null}
        <ReadySignal />
      </Suspense>
      {reduced ? <DemandKick /> : <FrameGuard onDemote={demote} />}
    </Canvas>
  );
}
