'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { CrtComputerModel } from './CrtComputerModel';

const GREEN = '#39ff14';
const CYAN = '#00ffff';
const AMBER = '#ffb000';
const BG = '#050807';

/* ------------------------------------------------------------------ */
/* Drifting phosphor particle field                                    */
/* ------------------------------------------------------------------ */

function generateParticles(count: number): readonly [Float32Array, Float32Array] {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const green = new THREE.Color(GREEN);
  const cyan = new THREE.Color(CYAN);
  const amber = new THREE.Color(AMBER);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    const roll = Math.random();
    const base = roll < 0.78 ? green : roll < 0.95 ? cyan : amber;
    const brightness = 0.3 + Math.random() * 0.7;
    col[i * 3] = base.r * brightness;
    col[i * 3 + 1] = base.g * brightness;
    col[i * 3 + 2] = base.b * brightness;
  }
  return [pos, col] as const;
}

// generated once at module load — this module is only ever loaded client-side
// (next/dynamic with ssr: false)
const PARTICLES = generateParticles(2200);

function ParticleField({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors] = PARTICLES;

  useFrame((state, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += delta * 0.018;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Slowly rotating wireframe geometry                                  */
/* ------------------------------------------------------------------ */

function WireIcosahedron({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.x += delta * 0.07;
    ref.current.rotation.y += delta * 0.11;
  });

  return (
    <mesh ref={ref} position={[-3.6, -0.3, -2.8]} rotation={[0.4, 0.7, 0.1]}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.16} toneMapped={false} />
    </mesh>
  );
}

function WireOctahedron({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y -= delta * 0.14;
    ref.current.rotation.z += delta * 0.05;
  });

  return (
    <mesh ref={ref} position={[4.4, 1.9, -4.5]} rotation={[0.2, 0.4, 0.6]}>
      <octahedronGeometry args={[0.9, 0]} />
      <meshBasicMaterial color={AMBER} wireframe transparent opacity={0.14} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

function SceneContents({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 7, 21]} />

      {/* lighting for the standard-material CRT model */}
      <ambientLight intensity={0.45} color="#86b890" />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#cfe8d2" />
      {/* phosphor rim light from behind-left */}
      <pointLight position={[-4, 2, -3]} intensity={26} color={GREEN} distance={14} decay={2} />
      {/* screen spill onto the keyboard/desk */}
      <pointLight position={[1.6, -0.1, 1.9]} intensity={5} color={GREEN} distance={6} decay={2} />

      <ParticleField reduced={reduced} />
      <WireIcosahedron reduced={reduced} />
      <WireOctahedron reduced={reduced} />

      {/* grid floor receding into fog */}
      <gridHelper args={[46, 46, '#1f8f2f', '#0a2c12']} position={[0, -2.5, 0]} />

      {reduced ? (
        <CrtComputerModel reduced />
      ) : (
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.35}>
          <CrtComputerModel reduced={false} />
        </Float>
      )}
    </>
  );
}

export default function HoloScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={reduced ? 'demand' : 'always'}
      camera={{ position: [0, 0.3, 5.4], fov: 50 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContents reduced={reduced} />
    </Canvas>
  );
}
