/**
 * Plain mutable state for 60 Hz values. Written by GSAP scrub tweens and pointer handlers,
 * read inside useFrame. Never subscribe React components to this.
 */
export const sceneState = {
  /** 0 → 1 as the hero scrolls out of view */
  heroProgress: 0,
  /** pointer lean target in normalised units (-1..1) */
  lean: { x: 0, y: 0 },
  leanActive: false,
  /** manual spin (radians) and its velocity (rad/frame) */
  spin: 0,
  angularVelocity: 0,
  dragging: false,
  /** performance.now() of the last user interaction with the tower */
  lastInteraction: 0,
  /** true while the hero canvas is within the viewport range we render */
  visible: true,
  /** set when the WebGL scene has produced its first frame */
  ready: false,
};

export type SceneState = typeof sceneState;
