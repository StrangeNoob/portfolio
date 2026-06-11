"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { MathUtils, Mesh, MeshStandardMaterial, type Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useScroll } from "framer-motion";

const MODEL_URL = "/models/rook_cream.glb";

useGLTF.preload(MODEL_URL);

/* GLB is exported in meters (~0.11 × 0.186 × 0.11), base at y=0,
   centered in X/Z. Scale ×10 → 1.86 units tall, recentered so the
   group origin is the rook's middle (yaw spins around its own axis). */
const MODEL_SCALE = 10;
const HALF_HEIGHT = (0.186 * MODEL_SCALE) / 2;

interface RookModelProps {
  onReady?: () => void;
}

function RookModel({ onReady }: RookModelProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const { scrollYProgress } = useScroll();

  // The CAD exporter writes metallic PBR materials; without an environment
  // map they render near-black. Normalize to matte ceramic, keeping colors.
  const rook = useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        for (const mat of mats) {
          if (mat instanceof MeshStandardMaterial) {
            mat.metalness = 0;
            mat.roughness = 0.55;
          }
        }
      }
    });
    return scene;
  }, [scene]);

  useEffect(() => {
    // useGLTF suspends until loaded, so reaching this effect means the
    // model is committed — parent can fade the sprite fallback out.
    onReady?.();
  }, [onReady]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // MotionValue read — no React re-render, no scroll listener layout work
    const p = scrollYProgress.get();

    // yaw: scroll-driven turn plus a slow idle sway, damped so it glides
    const yawTarget = p * Math.PI * 4 + Math.sin(t * 0.5) * 0.1;
    g.rotation.y = MathUtils.damp(g.rotation.y, yawTarget, 5, delta);

    // gentle idle tilt (kept tiny so the silhouette stays ceramic-still)
    g.rotation.z = Math.sin(t * 0.6) * 0.035;

    // idle bob + slight scroll-linked sink, matching the CSS parallax layers
    const yTarget = Math.sin(t * 0.8) * 0.05 - p * 0.6;
    g.position.y = MathUtils.damp(g.position.y, yTarget, 4, delta);
  });

  return (
    <group ref={group}>
      <primitive
        object={rook}
        scale={MODEL_SCALE}
        position={[0, -HALF_HEIGHT, 0]}
      />
    </group>
  );
}

export interface RookSceneProps {
  /** drive the frameloop: false freezes rendering when scrolled away */
  active: boolean;
  /** fired once the GLB is committed to the scene */
  onReady?: () => void;
}

/**
 * The one sanctioned WebGL object of this design: a small transparent
 * Canvas holding the ceramic rook. Soft warm lighting (hemisphere +
 * warm key + faint cool fill, tone mapping off) matches the paper
 * world; the grounded shadow stays the CSS ellipse outside the canvas.
 * pointer-events are disabled so no raycasting ever runs and the
 * hero's pointer-parallax rig keeps receiving events through it.
 */
export default function RookScene({ active, onReady }: RookSceneProps) {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      shadows={false}
      camera={{ position: [0, 0, 4.2], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <hemisphereLight args={["#fff8ec", "#e8dcc4", 1.35]} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.7} color="#ffe9cf" />
      <directionalLight
        position={[-3, 1.5, -2]}
        intensity={0.35}
        color="#f7f1e6"
      />
      <Suspense fallback={null}>
        <RookModel onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
