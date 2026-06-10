"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const CONCRETE_LIGHT = "#9a9a96";
const CONCRETE_DARK = "#6e6e6a";

type Slab = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
};

const SLABS: Slab[] = [
  { position: [0, 0.5, 0], size: [1.5, 5.2, 1.5], color: CONCRETE_LIGHT },
  { position: [-2.2, -0.7, 0.7], size: [1.1, 2.8, 1.1], color: CONCRETE_DARK },
  { position: [2.0, -1.0, -0.5], size: [1.25, 2.2, 1.25], color: CONCRETE_DARK },
  { position: [3.1, -1.6, 1.3], size: [0.85, 1.1, 0.85], color: CONCRETE_LIGHT },
  { position: [-3.3, -1.7, -0.9], size: [0.95, 0.95, 0.95], color: CONCRETE_LIGHT },
  { position: [1.1, -1.9, 1.9], size: [0.6, 0.45, 0.6], color: CONCRETE_DARK },
];

function Monoliths({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (animate && group.current) {
      // Slow, deliberate. A monument does not hurry.
      group.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={group} rotation={[0, 0.55, 0]}>
      {SLABS.map((slab, i) => (
        <mesh key={i} position={slab.position} castShadow receiveShadow>
          <boxGeometry args={slab.size} />
          <meshStandardMaterial
            color={slab.color}
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function MonolithScene({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [5.5, 2.2, 8.5], fov: 32 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Harsh single key light. Hard shadows, no mercy. */}
      <directionalLight
        position={[6, 9, 4]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={0.22} />
      {/* One violent accent: a signal-red rim from the left. */}
      <pointLight position={[-7, 1, -3]} intensity={14} color="#ff2b00" />

      <Monoliths animate={animate} />

      {/* Ground slab — catches the hard shadow. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.15, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#171715" roughness={1} metalness={0} />
      </mesh>

      <fog attach="fog" args={["#0c0c0c", 14, 30]} />
    </Canvas>
  );
}
