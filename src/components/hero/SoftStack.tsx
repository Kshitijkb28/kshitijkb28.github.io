"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  Color,
  EdgesGeometry,
  type Group,
  LineBasicMaterial,
  type Mesh,
  MeshStandardMaterial,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { easing } from "maath";
import { sceneState } from "@/lib/scene-state";
import { ramp } from "@/data/resume";
import type { TierConfig } from "@/lib/device-tier";

const SLAB_W = 2.2;
const SLAB_H = 0.12;
const SLAB_D = 1.4;
const BASE_GAP = 0.2;
const TANGERINE = new Color(ramp.tangerine);
const AMBER = new Color(ramp.amber);
const MINT = new Color(ramp.mint);

/** 0 = top (tangerine) … 1 = bottom (mint). */
function rampColor(t: number) {
  const c = new Color();
  if (t < 0.5) c.lerpColors(TANGERINE, AMBER, t * 2);
  else c.lerpColors(AMBER, MINT, (t - 0.5) * 2);
  return c;
}

/** Soft radial shadow blob (a canvas texture, no shadow maps). */
function makeShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0,0,0,0.6)");
    grad.addColorStop(0.55, "rgba(0,0,0,0.22)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  return new CanvasTexture(canvas);
}

/**
 * The "Soft Stack": N thin rounded slabs (shared geometry, one material per slab for colour + emissive, a shared
 * EdgesGeometry for the crisp outline). In useFrame every slab damps toward a lean target with a stiffness that
 * decreases up the tower (lambda 10 → 3), so a pointer move travels up the stack like a whip. The inner group
 * spins with drag/flick inertia and auto-rotates when idle; scroll progress deals the slabs apart.
 * Uses only three core + maath (no drei) to keep the lazy chunk small.
 */
export function SoftStack({ cfg, reduced }: { cfg: TierConfig; reduced: boolean }) {
  const N = cfg.slabs;
  const viewport = useThree((s) => s.viewport);
  const geometry = useMemo(() => new RoundedBoxGeometry(SLAB_W, SLAB_H, SLAB_D, 4, 0.05), []);
  const edges = useMemo(() => new EdgesGeometry(geometry, 15), [geometry]);
  const slabs = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const color = rampColor(N > 1 ? 1 - i / (N - 1) : 0);
        const material = new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.18, metalness: 0.2, roughness: 0.42 });
        const edgeMaterial = new LineBasicMaterial({ color, transparent: true, opacity: 0.75 });
        return { i, material, edgeMaterial };
      }),
    [N],
  );
  const shadow = useMemo(() => (cfg.shadows ? makeShadowTexture() : null), [cfg.shadows]);
  useEffect(
    () => () =>
      slabs.forEach((s) => {
        s.material.dispose();
        s.edgeMaterial.dispose();
      }),
    [slabs],
  );
  useEffect(
    () => () => {
      edges.dispose();
      geometry.dispose();
    },
    [edges, geometry],
  );
  useEffect(() => () => shadow?.dispose(), [shadow]);

  const meshes = useRef<(Mesh | null)[]>([]);
  const floatGroup = useRef<Group>(null);
  const spinGroup = useRef<Group>(null);
  const fit = useRef<Group>(null);
  const shadowMesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const s = sceneState;
    const dt = Math.min(delta, 1 / 30);
    const k = dt * 60;
    const p = s.heroProgress;
    const t = performance.now() / 1000; // not clock.elapsedTime: it resets whenever the frameloop restarts

    // Spin: drag writes spin/angularVelocity directly; here we apply inertia, decay and idle auto-rotation.
    if (!s.dragging) {
      s.angularVelocity *= Math.pow(0.94, k);
      if (Math.abs(s.angularVelocity) < 0.0002) s.angularVelocity = 0;
      s.spin += s.angularVelocity * k;
      if (!reduced && performance.now() - s.lastInteraction > 2500) s.spin += 0.004 * k;
    }
    if (spinGroup.current) spinGroup.current.rotation.y = (reduced ? 0.6 : 0) + s.spin + p * 0.6;

    // Idle float (replaces drei <Float>): gentle bob and sway.
    if (floatGroup.current) {
      const on = cfg.float && !reduced;
      floatGroup.current.position.y = on ? Math.sin(t * 1.1) * 0.09 : 0;
      floatGroup.current.rotation.x = on ? Math.sin(t * 0.7) * 0.025 : 0;
      floatGroup.current.rotation.z = on ? Math.cos(t * 0.9) * 0.02 : 0;
    }

    // Fit the tower into the canvas (phones have a short, narrow slot).
    const baseHeight = N * SLAB_H + (N - 1) * BASE_GAP;
    const scale = Math.min(1, (viewport.height * 0.9) / baseHeight, (viewport.width * 0.78) / (SLAB_W * 1.45));
    if (fit.current) fit.current.scale.setScalar(scale);

    // Slabs: deal apart with scroll, whip toward the lean target.
    const gap = BASE_GAP + p * 0.9;
    const height = N * SLAB_H + (N - 1) * gap;
    const lx = s.leanActive ? s.lean.x : 0;
    const ly = s.leanActive ? s.lean.y : 0;
    for (let i = 0; i < N; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const f = N > 1 ? i / (N - 1) : 0;
      mesh.position.y = -height / 2 + SLAB_H / 2 + i * (SLAB_H + gap);
      if (reduced) {
        mesh.position.x = 0;
        mesh.rotation.set(0, 0, 0);
        continue;
      }
      const smoothTime = 1 / (10 - 7 * f); // stiff base, loose top
      easing.damp(mesh.position, "x", lx * 1.1 * Math.sin((f * Math.PI) / 2), smoothTime, dt);
      easing.damp(mesh.rotation, "z", -lx * 0.22 * f, smoothTime, dt);
      easing.damp(mesh.rotation, "x", ly * 0.18 * f, smoothTime, dt);
    }
    if (shadowMesh.current) {
      shadowMesh.current.position.y = -height / 2 - 0.25;
      shadowMesh.current.position.x = lx * 0.3;
    }
  });

  return (
    <group ref={fit} rotation={[0.56, 0, -0.14]}>
      <group ref={floatGroup}>
        <group ref={spinGroup} rotation={[0, reduced ? 0.6 : 0, 0]}>
          {slabs.map((s) => (
            <mesh
              key={s.i}
              ref={(el) => {
                meshes.current[s.i] = el;
              }}
              geometry={geometry}
              material={s.material}
            >
              {cfg.edges ? <lineSegments geometry={edges} material={s.edgeMaterial} /> : null}
            </mesh>
          ))}
        </group>
        {shadow ? (
          <mesh ref={shadowMesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} renderOrder={-1}>
            <planeGeometry args={[5.2, 3.6]} />
            <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.9} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}
