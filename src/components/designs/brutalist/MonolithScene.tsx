"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import RookModel from "./RookModel";

function Turntable({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (animate && group.current) {
      // Slow, deliberate. A monument does not hurry.
      group.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <group ref={group} rotation={[0, 0.45, 0]}>
      <RookModel />
    </group>
  );
}

export default function MonolithScene({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
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
        <Turntable animate={animate} />
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
  );
}
