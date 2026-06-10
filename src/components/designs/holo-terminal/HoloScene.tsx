'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';

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
/* Floating holographic terminal screen                                */
/* ------------------------------------------------------------------ */

const SCREEN_LINES: ReadonlyArray<readonly [string, string]> = [
  ['guest@prateek:~$ whoami', '#39ff14'],
  ['Prateek Kumar Mohanty :: Full Stack Dev', '#c8ffb6'],
  ['', '#000000'],
  ['guest@prateek:~$ uptime', '#39ff14'],
  ['4+ years // web . mobile . ai-systems', '#c8ffb6'],
  ['', '#000000'],
  ['guest@prateek:~$ ./optimize --api', '#39ff14'],
  ['20s -> 300ms  [97% faster]  OK', '#00ffff'],
  ['', '#000000'],
  ['guest@prateek:~$ run rag-hotel-search', '#39ff14'],
  ['1.2K+ hotels indexed in <10s', '#ffb000'],
  ['natural-language search :: ONLINE _', '#c8ffb6'],
];

function createScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#04150c');
    gradient.addColorStop(1, '#020a06');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '500 30px "JetBrains Mono", "Courier New", monospace';
    ctx.textBaseline = 'top';
    let y = 42;
    for (const [text, color] of SCREEN_LINES) {
      if (text) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        ctx.fillStyle = color;
        ctx.fillText(text, 52, y);
      }
      y += 46;
    }

    // baked-in scanlines
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let sy = 0; sy < canvas.height; sy += 4) {
      ctx.fillRect(0, sy, canvas.width, 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function HoloScreen({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const scanBar = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const texture = useMemo(() => createScreenTexture(), []);
  const frameGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.74, 2.46)),
    [],
  );

  useFrame((state) => {
    if (reduced || !group.current) return;
    const t = state.clock.elapsedTime;

    // tilt/parallax toward the cursor
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.38,
      0.06,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.26,
      0.06,
    );

    // holographic flicker (emissive-style opacity pulsing)
    if (screenMat.current) {
      const flicker =
        0.9 +
        Math.sin(t * 9.3) * 0.035 +
        Math.sin(t * 27.1) * 0.025 +
        (Math.random() < 0.015 ? -0.22 : 0);
      screenMat.current.opacity = THREE.MathUtils.clamp(flicker, 0.55, 1);
    }

    // scan highlight sweeping down the screen
    if (scanBar.current) {
      scanBar.current.position.y = 1.1 - ((t * 0.55) % 2.3);
    }
  });

  // pull the screen to center on narrow viewports so it stays visible
  const x = viewport.width < 7 ? 0 : 1.45;

  return (
    <group ref={group} position={[x, 0.35, 0]}>
      {/* soft glow backdrop */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[4.4, 3]} />
        <meshBasicMaterial
          color={GREEN}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* terminal screen */}
      <mesh>
        <planeGeometry args={[3.64, 2.36]} />
        <meshBasicMaterial
          ref={screenMat}
          map={texture}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* scan highlight */}
      <mesh ref={scanBar} position={[0, 0.6, 0.012]}>
        <planeGeometry args={[3.64, 0.09]} />
        <meshBasicMaterial
          color={GREEN}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* glowing frame */}
      <lineSegments geometry={frameGeometry}>
        <lineBasicMaterial color={GREEN} transparent opacity={0.8} toneMapped={false} />
      </lineSegments>
    </group>
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

      <ParticleField reduced={reduced} />
      <WireIcosahedron reduced={reduced} />
      <WireOctahedron reduced={reduced} />

      {/* grid floor receding into fog */}
      <gridHelper args={[46, 46, '#1f8f2f', '#0a2c12']} position={[0, -2.5, 0]} />

      {reduced ? (
        <HoloScreen reduced />
      ) : (
        <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.5}>
          <HoloScreen reduced={false} />
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
