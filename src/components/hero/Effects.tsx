"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

/** Desktop high-tier only. Bloom alone: a vignette would darken the transparent canvas edges below the page colour. */
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.45} luminanceThreshold={0.88} luminanceSmoothing={0.08} radius={0.55} />
    </EffectComposer>
  );
}
