"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import BrutalistTower from "./BrutalistTowerModel";

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
      <BrutalistTower />
    </group>
  );
}

export default function MonolithScene({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [8, 3.6, 11], fov: 33 }}
      gl={{ antialias: true }}
      onCreated={({ camera }) => camera.lookAt(0, 1.3, 0)}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Harsh single key light. Hard shadows raking the facades are the show. */}
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

      <Turntable animate={animate} />

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
