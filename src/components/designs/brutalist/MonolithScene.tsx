"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { MathUtils, type Group } from "three";
import RookModel from "./RookModel";

/* ---------------- choreography constants ---------------- */

const BASE_YAW = 0.45; // resting pose
const IDLE_SPIN = 0.07; // rad/s — the slow turntable
const SCROLL_YAW = 2.5; // extra rad across the full page scroll
const SINK_DEPTH = 0.55; // units the monument sinks over the first viewport
const DAMP_LAMBDA = 5; // glide, don't step

function ScrollTurntable({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  const scroller = useRef<HTMLElement | null>(null);
  const baseYaw = useRef(BASE_YAW);

  // Resolve the inner scroll container once on the client. No listeners:
  // scrollTop is read directly inside the frame loop.
  useEffect(() => {
    scroller.current = document.querySelector<HTMLElement>(
      "[data-design-root]",
    );
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || !animate) return;

    const dt = Math.min(delta, 0.1); // guard against tab-switch time jumps

    // Slow, deliberate. A monument does not hurry.
    baseYaw.current += dt * IDLE_SPIN;

    let totalProgress = 0;
    let heroProgress = 0;
    const el = scroller.current;
    if (el) {
      const max = el.scrollHeight - el.clientHeight;
      totalProgress = max > 0 ? MathUtils.clamp(el.scrollTop / max, 0, 1) : 0;
      heroProgress = MathUtils.clamp(el.scrollTop / el.clientHeight, 0, 1);
    }

    // Scroll turns the monument; the red doorway sweeps past the camera.
    const targetYaw = baseYaw.current + totalProgress * SCROLL_YAW;
    // The monument sinks as the hero leaves.
    const targetY = -heroProgress * SINK_DEPTH;

    // Damped — the rook glides toward its targets, never steps.
    g.rotation.y = MathUtils.damp(g.rotation.y, targetYaw, DAMP_LAMBDA, dt);
    g.position.y = MathUtils.damp(g.position.y, targetY, DAMP_LAMBDA, dt);
  });

  return (
    <group ref={group} rotation={[0, BASE_YAW, 0]}>
      <RookModel />
    </group>
  );
}

export default function MonolithScene({ animate }: { animate: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // While the hero canvas is scrolled out of view, halt the frame loop
  // entirely so the GPU idles.
  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        setInView(entry.isIntersecting);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Reduced motion: render on demand (static frame, idle GPU).
  const frameloop = !animate ? "demand" : inView ? "always" : "never";

  return (
    <div ref={wrapper} style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 2]}
        shadows
        frameloop={frameloop}
        camera={{ position: [7.5, 3.0, 10.5], fov: 32 }}
        gl={{ antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.7, 0)}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Harsh single key light. Raking shadows across the window slots
            and crenellations are the show. */}
        <directionalLight
          position={[7, 10, 5]}
          intensity={2.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
        />
        <ambientLight intensity={0.22} />
        {/* One violent accent: a signal-red rim from the left. */}
        <pointLight position={[-8, 2, -4]} intensity={16} color="#ff2b00" />

        <Suspense fallback={null}>
          <ScrollTurntable animate={animate} />
        </Suspense>

        {/* Ground slab — catches the hard shadow. */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.15, 0]}
          receiveShadow
        >
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#171715" roughness={1} metalness={0} />
        </mesh>

        <fog attach="fog" args={["#0c0c0c", 15, 34]} />
      </Canvas>
    </div>
  );
}
