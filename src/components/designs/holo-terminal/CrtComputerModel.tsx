'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';

const GREEN = '#39ff14';
const BASE_YAW = -0.3;

/* ================================================================== */
/* Shared materials — module scope so every mesh reuses one instance.  */
/* This module is only ever loaded client-side (dynamic, ssr: false).  */
/* ================================================================== */

const caseMaterial = new THREE.MeshStandardMaterial({
  color: '#232a23',
  roughness: 0.85,
  metalness: 0.12,
});

const darkCaseMaterial = new THREE.MeshStandardMaterial({
  color: '#1a1f1a',
  roughness: 0.8,
  metalness: 0.18,
});

const ventMaterial = new THREE.MeshStandardMaterial({
  color: '#0a0f0a',
  roughness: 0.95,
  metalness: 0,
});

const keycapMaterial = new THREE.MeshStandardMaterial({
  // white base — per-instance colors multiply against it
  color: '#ffffff',
  roughness: 0.65,
  metalness: 0.05,
});

const labelMaterial = new THREE.MeshStandardMaterial({
  color: '#8fa893',
  roughness: 0.9,
  metalness: 0,
});

const shutterMaterial = new THREE.MeshStandardMaterial({
  color: '#55675a',
  roughness: 0.4,
  metalness: 0.6,
});

const ledMaterial = new THREE.MeshStandardMaterial({
  color: '#0c120c',
  emissive: new THREE.Color(GREEN),
  emissiveIntensity: 2,
});

const glowMaterial = new THREE.MeshBasicMaterial({
  color: GREEN,
  transparent: true,
  opacity: 0.05,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  toneMapped: false,
});

const scanMaterial = new THREE.MeshBasicMaterial({
  color: GREEN,
  transparent: true,
  opacity: 0.14,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  toneMapped: false,
});

/* ================================================================== */
/* Procedural geometries (parametric-CAD style construction)           */
/* ================================================================== */

/** Box whose rear face is scaled down — the classic CRT frustum shell. */
function createTaperedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  rearTaper: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const z = position.getZ(i);
    const t = THREE.MathUtils.mapLinear(z, -depth / 2, depth / 2, rearTaper, 1);
    position.setX(i, position.getX(i) * t);
    position.setY(i, position.getY(i) * t);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function roundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const w = width / 2;
  const h = height / 2;
  shape.moveTo(-w + radius, -h);
  shape.lineTo(w - radius, -h);
  shape.quadraticCurveTo(w, -h, w, -h + radius);
  shape.lineTo(w, h - radius);
  shape.quadraticCurveTo(w, h, w - radius, h);
  shape.lineTo(-w + radius, h);
  shape.quadraticCurveTo(-w, h, -w, h - radius);
  shape.lineTo(-w, -h + radius);
  shape.quadraticCurveTo(-w, -h, -w + radius, -h);
  return shape;
}

/** Beveled bezel plate with a rounded screen cutout, extruded forward. */
function createBezelGeometry(): THREE.ExtrudeGeometry {
  const plate = roundedRectShape(2.24, 1.74, 0.12);
  const hole = roundedRectShape(1.9, 1.24, 0.06);
  plate.holes.push(new THREE.Path(hole.getPoints(8)));
  return new THREE.ExtrudeGeometry(plate, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 6,
  });
}

/** Single keycap: rounded square extruded with a bevel, top facing +y. */
function createKeycapGeometry(): THREE.ExtrudeGeometry {
  const shape = roundedRectShape(0.095, 0.095, 0.024);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.034,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.011,
    bevelSegments: 2,
    curveSegments: 3,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

/** Keyboard base: thin box with the rear-top edge raised into a wedge. */
function createWedgeGeometry(
  width: number,
  height: number,
  depth: number,
  backRise: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    if (position.getY(i) > 0 && position.getZ(i) < 0) {
      position.setY(i, position.getY(i) + backRise);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

const shellGeometry = createTaperedBoxGeometry(2.35, 1.85, 1.3, 0.78);
const bezelGeometry = createBezelGeometry();
const keycapGeometry = createKeycapGeometry();
const wedgeGeometry = createWedgeGeometry(2.05, 0.13, 0.8, 0.07);
const ventGeometry = new THREE.BoxGeometry(0.72, 0.012, 0.05);

/* ================================================================== */
/* Keyboard layout (deterministic, built once)                         */
/* ================================================================== */

interface KeyDef {
  x: number;
  z: number;
  w: number;
  accent: boolean;
}

function buildKeyboardLayout(): KeyDef[] {
  const pitch = 0.135;
  const keys: KeyDef[] = [];
  const rows = [
    { count: 14, z: -0.27, stagger: 0 },
    { count: 14, z: -0.125, stagger: 0.18 },
    { count: 13, z: 0.02, stagger: 0.42 },
    { count: 12, z: 0.165, stagger: 0.66 },
  ];
  for (const row of rows) {
    const start = -((row.count - 1) * pitch) / 2 + row.stagger * pitch * 0.2;
    for (let i = 0; i < row.count; i++) {
      keys.push({ x: start + i * pitch, z: row.z, w: 1, accent: false });
    }
  }
  // accents + oversized keys
  keys[0].accent = true; // Esc
  const enter = keys[14 + 14 + 13 - 1];
  enter.w = 1.5;
  enter.x += 0.03;
  enter.accent = true;
  // bottom row: modifiers + spacebar
  keys.push(
    { x: -0.74, z: 0.31, w: 1.4, accent: false },
    { x: -0.54, z: 0.31, w: 1, accent: false },
    { x: 0, z: 0.31, w: 4.4, accent: false }, // spacebar
    { x: 0.54, z: 0.31, w: 1, accent: false },
    { x: 0.74, z: 0.31, w: 1.4, accent: true },
  );
  return keys;
}

const KEYBOARD_KEYS = buildKeyboardLayout();
const KEY_COLOR = '#2e372e';
const KEY_ACCENT_COLOR = '#2f9e44';

/* vent slot rows along the sloped top, near the rear */
const TOP_SLOPE = Math.atan(((1 - 0.78) * 1.85) / 2 / 1.3); // ≈ 0.155 rad
const VENT_SLOTS = [-0.5, -0.42, -0.34, -0.26, -0.18, -0.1].map((z) => ({
  z,
  y: (1.85 / 2) * THREE.MathUtils.mapLinear(z, -0.65, 0.65, 0.78, 1) + 0.004,
}));

/* ================================================================== */
/* Screen texture (CanvasTexture terminal output)                      */
/* ================================================================== */

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

/* ================================================================== */
/* The model                                                           */
/* ================================================================== */

export function CrtComputerModel({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const scanBar = useRef<THREE.Mesh>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const { viewport } = useThree();

  const texture = useMemo(() => createScreenTexture(), []);

  useFrame((state) => {
    if (reduced || !root.current) return;
    const t = state.clock.elapsedTime;

    // whole computer tilts/parallaxes toward the cursor
    root.current.rotation.y = THREE.MathUtils.lerp(
      root.current.rotation.y,
      BASE_YAW + state.pointer.x * 0.32,
      0.06,
    );
    root.current.rotation.x = THREE.MathUtils.lerp(
      root.current.rotation.x,
      -state.pointer.y * 0.18,
      0.06,
    );

    // holographic flicker on the phosphor screen
    if (screenMat.current) {
      const flicker =
        0.92 +
        Math.sin(t * 9.3) * 0.03 +
        Math.sin(t * 27.1) * 0.022 +
        (Math.random() < 0.015 ? -0.22 : 0);
      screenMat.current.opacity = THREE.MathUtils.clamp(flicker, 0.55, 1);
    }

    // scan highlight sweeping down the tube
    if (scanBar.current) {
      scanBar.current.position.y = 0.55 - ((t * 0.45) % 1.18);
    }

    // power LED breathing with occasional spike
    ledMaterial.emissiveIntensity =
      2 + Math.sin(t * 2.2) * 0.9 + (Math.random() < 0.008 ? 1.4 : 0);
  });

  // centerpiece placement: centered on narrow viewports, offset right on wide
  const narrow = viewport.width < 7;
  const x = narrow ? 0 : 1.55;
  const scale = narrow ? 0.72 : 0.88;

  return (
    <group
      ref={root}
      position={[x, -1.02, 0.1]}
      scale={scale}
      rotation={[0, BASE_YAW, 0]}
    >
      {/* ---------- stand / pedestal ---------- */}
      <mesh material={darkCaseMaterial} position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.55, 0.72, 0.14, 24]} />
      </mesh>
      <mesh material={caseMaterial} position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.17, 0.21, 0.26, 16]} />
      </mesh>

      {/* ---------- monitor head ---------- */}
      <group position={[0, 1.32, 0]}>
        {/* tapered shell */}
        <mesh geometry={shellGeometry} material={caseMaterial} />

        {/* rear tube bulge */}
        <mesh material={caseMaterial} position={[0, 0.02, -0.55]} scale={[1, 0.85, 0.75]}>
          <sphereGeometry args={[0.82, 20, 14]} />
        </mesh>

        {/* vent slots on the sloped top */}
        {VENT_SLOTS.map((slot) => (
          <mesh
            key={slot.z}
            geometry={ventGeometry}
            material={ventMaterial}
            position={[0, slot.y, slot.z]}
            rotation={[-TOP_SLOPE, 0, 0]}
          />
        ))}

        {/* beveled front bezel with screen cutout */}
        <mesh geometry={bezelGeometry} material={darkCaseMaterial} position={[0, 0, 0.66]} />

        {/* phosphor screen (CanvasTexture terminal output) */}
        <mesh position={[0, 0, 0.665]}>
          <planeGeometry args={[1.86, 1.16]} />
          <meshBasicMaterial
            ref={screenMat}
            map={texture}
            toneMapped={false}
            transparent
            opacity={0.96}
          />
        </mesh>

        {/* scan highlight */}
        <mesh ref={scanBar} material={scanMaterial} position={[0, 0.55, 0.675]}>
          <planeGeometry args={[1.86, 0.05]} />
        </mesh>

        {/* soft glass glow in front of the tube */}
        <mesh material={glowMaterial} position={[0, 0, 0.8]}>
          <planeGeometry args={[2.05, 1.4]} />
        </mesh>

        {/* power LED, bottom-right of the bezel */}
        <mesh material={ledMaterial} position={[0.95, -0.76, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.025, 10]} />
        </mesh>
      </group>

      {/* ---------- keyboard ---------- */}
      <group position={[0, 0, 1.25]} rotation={[0, 0.02, 0]}>
        {/* base wedge */}
        <mesh geometry={wedgeGeometry} material={darkCaseMaterial} position={[0, 0.075, 0]} />

        {/* keycaps on the sloped deck — one instanced draw call */}
        <group position={[0, 0.175, 0]} rotation={[Math.atan(0.07 / 0.8), 0, 0]}>
          <Instances
            limit={KEYBOARD_KEYS.length}
            geometry={keycapGeometry}
            material={keycapMaterial}
          >
            {KEYBOARD_KEYS.map((key) => (
              <Instance
                key={`${key.x.toFixed(3)}:${key.z.toFixed(3)}`}
                position={[key.x, 0, key.z]}
                scale={[key.w, 1, 1]}
                color={key.accent ? KEY_ACCENT_COLOR : KEY_COLOR}
              />
            ))}
          </Instances>
        </group>
      </group>

      {/* ---------- desk props: two floppy disks ---------- */}
      <group position={[1.4, 0, 0.85]} rotation={[0, 0.55, 0]}>
        <mesh material={darkCaseMaterial} position={[0, 0.01, 0]}>
          <boxGeometry args={[0.5, 0.018, 0.5]} />
        </mesh>
        <mesh material={caseMaterial} position={[0.05, 0.029, 0.03]} rotation={[0, -0.22, 0]}>
          <boxGeometry args={[0.5, 0.018, 0.5]} />
        </mesh>
        {/* label + shutter on the top disk */}
        <mesh
          material={labelMaterial}
          position={[0.02, 0.0395, 0.13]}
          rotation={[-Math.PI / 2, 0, -0.22]}
        >
          <planeGeometry args={[0.32, 0.2]} />
        </mesh>
        <mesh material={shutterMaterial} position={[0.08, 0.039, -0.12]} rotation={[0, -0.22, 0]}>
          <boxGeometry args={[0.26, 0.004, 0.14]} />
        </mesh>
      </group>
    </group>
  );
}
