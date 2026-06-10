"use client";

import { Instance, Instances } from "@react-three/drei";
import { BoxGeometry, MeshStandardMaterial } from "three";

/**
 * Procedural brutalist tower — Boston City Hall / Barbican energy.
 * One shared unit-box geometry, four shared materials, four instanced
 * batches (windows, fins/pilotis, stair steps, formwork seams).
 * Everything is computed once at module scope: zero per-frame work.
 */

/* ---------------- shared resources (created exactly once) ---------------- */

const unitBox = new BoxGeometry(1, 1, 1);

const concreteLight = new MeshStandardMaterial({
  color: "#9a9a96",
  roughness: 0.95,
  metalness: 0,
});
const concreteDark = new MeshStandardMaterial({
  color: "#6e6e6a",
  roughness: 0.95,
  metalness: 0,
});
const voidBlack = new MeshStandardMaterial({
  color: "#121210",
  roughness: 1,
  metalness: 0,
});
const signalRed = new MeshStandardMaterial({
  color: "#ff2b00",
  roughness: 0.55,
  metalness: 0,
});
/* White base so per-instance colors read true (they multiply). */
const instanceMat = new MeshStandardMaterial({
  color: "#ffffff",
  roughness: 0.95,
  metalness: 0,
});

/* ---------------- deterministic shade variation ---------------- */

function gray(base: number, seed: number, spread = 0.05): string {
  const t = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  const f = t - Math.floor(t);
  const v = Math.min(1, Math.max(0, base * (1 + (f - 0.5) * 2 * spread)));
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  const r = Math.round(v * 255);
  const b = Math.round(v * 0.97 * 255); // faint warm cast, like cured concrete
  return `#${hex(r)}${hex(r)}${hex(b)}`;
}

/* ---------------- composition constants ---------------- */

const G = -2.15; // ground plane y (matches MonolithScene)
const PODIUM_TOP = G + 0.5;

type Vec3 = [number, number, number];
type InstanceDatum = { position: Vec3; scale: Vec3; color: string };
type VolumeSpec = { position: Vec3; scale: Vec3; mat: MeshStandardMaterial };

/*
 * Massing (centers / sizes):
 *   podium  — full-footprint plinth
 *   A shaft — main volume       x:[-1.8, 0.8]  y:[-1.65, 1.75]  z:[-1.1, 1.1]
 *   B       — cantilever slab   x:[-1.3, 2.3]  y:[ 1.75, 3.05]  z:[-1.25, 1.35]
 *   C       — upper volume      x:[-1.65,0.25] y:[ 3.05, 4.75]  z:[-1.0, 0.7]
 *   annex   — low back wing, stair blade wall, rooftop mechanicals
 */
const VOLUMES: VolumeSpec[] = [
  { position: [0, G + 0.25, 0], scale: [5.6, 0.5, 4.4], mat: concreteDark },
  { position: [-0.5, PODIUM_TOP + 1.7, 0], scale: [2.6, 3.4, 2.2], mat: concreteLight },
  { position: [0.5, 2.4, 0.05], scale: [3.6, 1.3, 2.6], mat: concreteDark },
  { position: [-0.7, 3.9, -0.15], scale: [1.9, 1.7, 1.7], mat: concreteLight },
  { position: [-1.5, PODIUM_TOP + 0.45, -1.62], scale: [1.8, 0.9, 1.1], mat: concreteDark },
  // stair blade wall (spine of the switchback run)
  { position: [-2.55, 0.05, 0.05], scale: [0.08, 3.4, 2.0], mat: concreteLight },
  // rooftop mechanical blocks
  { position: [-0.45, 4.975, -0.35], scale: [0.9, 0.45, 0.7], mat: concreteDark },
  { position: [-1.15, 5.2, 0.1], scale: [0.35, 0.9, 0.35], mat: concreteLight },
];

/* Recessed entrance void + THE single red element: an offset doorway. */
const ENTRANCE_VOID: VolumeSpec = {
  position: [0.1, PODIUM_TOP + 0.65, 1.02],
  scale: [0.9, 1.3, 0.25],
  mat: voidBlack,
};
const RED_DOOR: VolumeSpec = {
  position: [0.28, PODIUM_TOP + 0.475, 1.13],
  scale: [0.5, 0.95, 0.08],
  mat: signalRed,
};

/* ---------------- window slots (instanced dark insets) ---------------- */

const WINDOWS: InstanceDatum[] = [];
{
  let i = 0;
  const slot = (position: Vec3, scale: Vec3) => {
    WINDOWS.push({ position, scale, color: gray(0.07, i++, 0.35) });
  };

  // A front (z = 1.1): 8 columns x 3 rows, clear of the entrance void
  for (let c = 0; c < 8; c++) {
    for (const y of [0.0, 0.75, 1.48]) {
      slot([-1.55 + c * 0.3, y, 1.1], [0.16, 0.46, 0.07]);
    }
  }
  // A back (z = -1.1): 8 columns x 4 rows
  for (let c = 0; c < 8; c++) {
    for (const y of [-0.95, -0.2, 0.55, 1.3]) {
      slot([-1.55 + c * 0.3, y, -1.1], [0.16, 0.5, 0.07]);
    }
  }
  // A right (x = 0.8): 7 columns between the fins x 4 rows
  for (let c = 0; c < 7; c++) {
    for (const y of [-0.95, -0.2, 0.55, 1.3]) {
      slot([0.8, y, -0.9 + c * 0.3], [0.07, 0.5, 0.16]);
    }
  }
  // B front ribbon (z = 1.35): 11 slots
  for (let c = 0; c < 11; c++) {
    slot([-1.1 + c * 0.31, 2.4, 1.35], [0.16, 0.62, 0.07]);
  }
  // B right (x = 2.3): 9 slots
  for (let c = 0; c < 9; c++) {
    slot([2.3, 2.4, -1.0 + c * 0.25], [0.07, 0.62, 0.16]);
  }
  // C front (z = 0.7): 6 columns x 2 rows
  for (let c = 0; c < 6; c++) {
    for (const y of [3.6, 4.35]) {
      slot([-1.4 + c * 0.28, y, 0.7], [0.15, 0.5, 0.07]);
    }
  }
  // C right (x = 0.25): 5 columns x 2 rows
  for (let c = 0; c < 5; c++) {
    for (const y of [3.6, 4.35]) {
      slot([0.25, y, -0.75 + c * 0.3], [0.07, 0.5, 0.15]);
    }
  }
  // annex front (z = -1.07): 4 low slots
  for (let c = 0; c < 4; c++) {
    slot([-2.1 + c * 0.4, -1.2, -1.06], [0.14, 0.4, 0.07]);
  }
}

/* ---------------- fins + pilotis (instanced thin verticals) ---------------- */

const SLATS: InstanceDatum[] = [];
{
  let i = 0;
  // rhythmic full-height fins on A's right facade
  for (let c = 0; c < 8; c++) {
    SLATS.push({
      position: [0.84, 0.05, -1.05 + c * 0.3],
      scale: [0.12, 3.4, 0.09],
      color: gray(0.6, i++),
    });
  }
  // pilotis carrying B's cantilever (podium top -> B underside)
  for (const z of [-0.9, -0.3, 0.3, 0.9]) {
    SLATS.push({
      position: [2.1, 0.05, z],
      scale: [0.13, 3.4, 0.13],
      color: gray(0.58, i++),
    });
  }
  // short fins on C's left facade
  for (let c = 0; c < 5; c++) {
    SLATS.push({
      position: [-1.69, 3.9, -0.85 + c * 0.3],
      scale: [0.1, 1.7, 0.08],
      color: gray(0.6, i++),
    });
  }
}

/* ---------------- external switchback stair (instanced steps) ---------------- */

const STEPS: InstanceDatum[] = [];
{
  const flights = 4;
  const perFlight = 11;
  const rise = 3.4 / (flights * perFlight);
  let y = PODIUM_TOP + rise / 2;
  let i = 0;
  for (let f = 0; f < flights; f++) {
    const dir = f % 2 === 0 ? -1 : 1;
    const x = f % 2 === 0 ? -2.05 : -2.38;
    let z = dir === -1 ? 0.78 : -0.78;
    for (let s = 0; s < perFlight; s++) {
      STEPS.push({
        position: [x, y, z],
        scale: [0.34, 0.07, 0.3],
        color: gray(0.5, i++),
      });
      y += rise;
      z += dir * 0.142;
    }
    // switchback landing spanning both runs
    STEPS.push({
      position: [-2.215, y - rise / 2, dir === -1 ? -0.95 : 0.95],
      scale: [0.78, 0.08, 0.42],
      color: gray(0.52, i++),
    });
  }
}

/* ------------- board-formed concrete seams (instanced thin reveals) ------------- */

const SEAMS: InstanceDatum[] = [];
{
  let i = 0;
  // horizontal formwork joints on the A shaft, front / back / left
  for (let r = 0; r < 6; r++) {
    const y = -1.0 + r * 0.5;
    SEAMS.push({
      position: [-0.5, y, 1.108],
      scale: [2.6, 0.02, 0.015],
      color: gray(0.5, i++, 0.08),
    });
    SEAMS.push({
      position: [-0.5, y, -1.108],
      scale: [2.6, 0.02, 0.015],
      color: gray(0.5, i++, 0.08),
    });
    SEAMS.push({
      position: [-1.808, y, 0],
      scale: [0.015, 0.02, 2.2],
      color: gray(0.5, i++, 0.08),
    });
  }
  // joints on the C volume front
  for (let r = 0; r < 4; r++) {
    SEAMS.push({
      position: [-0.7, 3.3 + r * 0.4, 0.708],
      scale: [1.9, 0.02, 0.015],
      color: gray(0.5, i++, 0.08),
    });
  }
}

/* ---------------- component ---------------- */

export default function BrutalistTower() {
  return (
    <group>
      {VOLUMES.map((v, i) => (
        <mesh
          key={i}
          geometry={unitBox}
          material={v.mat}
          position={v.position}
          scale={v.scale}
          castShadow
          receiveShadow
        />
      ))}

      {/* recessed entrance + the one violent red element */}
      <mesh
        geometry={unitBox}
        material={ENTRANCE_VOID.mat}
        position={ENTRANCE_VOID.position}
        scale={ENTRANCE_VOID.scale}
        receiveShadow
      />
      <mesh
        geometry={unitBox}
        material={RED_DOOR.mat}
        position={RED_DOOR.position}
        scale={RED_DOOR.scale}
        castShadow
      />

      <Instances
        limit={WINDOWS.length}
        geometry={unitBox}
        material={instanceMat}
        receiveShadow
      >
        {WINDOWS.map((w, i) => (
          <Instance
            key={i}
            position={w.position}
            scale={w.scale}
            color={w.color}
          />
        ))}
      </Instances>

      <Instances
        limit={SLATS.length}
        geometry={unitBox}
        material={instanceMat}
        castShadow
        receiveShadow
      >
        {SLATS.map((s, i) => (
          <Instance
            key={i}
            position={s.position}
            scale={s.scale}
            color={s.color}
          />
        ))}
      </Instances>

      <Instances
        limit={STEPS.length}
        geometry={unitBox}
        material={instanceMat}
        castShadow
        receiveShadow
      >
        {STEPS.map((s, i) => (
          <Instance
            key={i}
            position={s.position}
            scale={s.scale}
            color={s.color}
          />
        ))}
      </Instances>

      <Instances
        limit={SEAMS.length}
        geometry={unitBox}
        material={instanceMat}
        receiveShadow
      >
        {SEAMS.map((s, i) => (
          <Instance
            key={i}
            position={s.position}
            scale={s.scale}
            color={s.color}
          />
        ))}
      </Instances>
    </group>
  );
}
