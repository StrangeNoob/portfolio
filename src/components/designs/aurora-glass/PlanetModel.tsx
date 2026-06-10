"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* GLSL                                                                */
/* ------------------------------------------------------------------ */

const PLANET_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vObjPos;

void main() {
  vObjPos = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const PLANET_FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vObjPos;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);

  /* Warped latitudinal bands — gas-giant flavour in the aurora palette */
  float lat = vObjPos.y;
  float swirl = sin(vObjPos.x * 2.3 + uTime * 0.05) * 0.35
              + sin(vObjPos.z * 3.1 - uTime * 0.04) * 0.3;
  float bands = sin(lat * 7.0 + swirl) * 0.5 + 0.5;

  vec3 teal    = vec3(0.05, 0.38, 0.36);
  vec3 indigo  = vec3(0.16, 0.18, 0.5);
  vec3 magenta = vec3(0.42, 0.13, 0.38);

  vec3 surf = mix(teal, indigo, smoothstep(0.0, 0.55, bands));
  surf = mix(surf, magenta, smoothstep(0.55, 1.0, bands));

  /* Fake key light, upper-left, for sphericity against the dark field */
  float light = clamp(dot(n, normalize(vec3(-0.42, 0.58, 0.7))), 0.0, 1.0);
  vec3 color = surf * (0.16 + 0.9 * light);

  /* Iridescent fresnel rim — teal/violet shifting with view angle */
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6);
  vec3 rim = mix(vec3(0.3, 0.85, 0.78), vec3(0.62, 0.5, 1.0), bands);
  color += rim * fres * 0.55;

  gl_FragColor = vec4(color, 1.0);
}
`;

const ATMO_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const ATMO_FRAGMENT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  /* BackSide shell: brightest at the planet limb, fading outward */
  float d = clamp(-dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
  float intensity = pow(d * 2.1, 2.4);
  vec3 glow = mix(vec3(0.25, 0.7, 0.68), vec3(0.55, 0.42, 0.95), d * 1.6);
  gl_FragColor = vec4(glow, clamp(intensity, 0.0, 1.0) * 0.6);
}
`;

const RING_VERTEX = /* glsl */ `
varying vec2 vPos;

void main() {
  vPos = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const RING_FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec2 vPos;

void main() {
  float r = length(vPos);
  float angle = atan(vPos.y, vPos.x);

  /* Three concentric annuli with soft edges */
  float band1 = smoothstep(1.46, 1.56, r) * (1.0 - smoothstep(1.78, 1.88, r));
  float band2 = smoothstep(1.96, 2.03, r) * (1.0 - smoothstep(2.22, 2.30, r));
  float band3 = smoothstep(2.37, 2.42, r) * (1.0 - smoothstep(2.51, 2.57, r));

  /* Fine radial grain, like packed ringlets */
  float grain = 0.72 + 0.28 * sin(r * 58.0);

  /* Each annulus shimmers at its own angular speed */
  float shimmer1 = 0.82 + 0.18 * sin(angle * 3.0 + uTime * 0.14);
  float shimmer2 = 0.82 + 0.18 * sin(angle * 4.0 - uTime * 0.10);
  float shimmer3 = 0.82 + 0.18 * sin(angle * 5.0 + uTime * 0.07);

  float a = band1 * 0.42 * shimmer1
          + band2 * 0.30 * shimmer2
          + band3 * 0.20 * shimmer3;
  a *= grain;

  /* Radial colour drift: teal -> indigo -> magenta */
  float tcol = smoothstep(1.46, 2.57, r);
  vec3 col = mix(vec3(0.32, 0.72, 0.66), vec3(0.42, 0.42, 0.92), smoothstep(0.0, 0.5, tcol));
  col = mix(col, vec3(0.76, 0.38, 0.82), smoothstep(0.5, 1.0, tcol));

  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}
`;

const SPARKLE_VERTEX = /* glsl */ `
attribute float aPhase;
attribute float aSize;
uniform float uTime;
varying float vAlpha;

void main() {
  vAlpha = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 0.9 + aPhase));
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (26.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const SPARKLE_FRAGMENT = /* glsl */ `
varying float vAlpha;

void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float a = smoothstep(0.5, 0.05, length(d));
  gl_FragColor = vec4(vec3(0.82, 0.84, 1.0), a * vAlpha * 0.7);
}
`;

const MOON_VERTEX = /* glsl */ `
varying vec3 vViewPos;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const MOON_FRAGMENT = /* glsl */ `
uniform vec3 uTint;
varying vec3 vViewPos;

void main() {
  /* Faceted normals from screen-space derivatives: cut-gem glass look */
  vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
  vec3 v = normalize(-vViewPos);

  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
  float facet = 0.5 + 0.5 * dot(n, normalize(vec3(-0.42, 0.58, 0.7)));

  vec3 col = uTint * (0.22 + 0.5 * facet) + vec3(0.68, 0.74, 1.0) * fres * 0.8;
  float alpha = 0.4 + 0.6 * fres;

  gl_FragColor = vec4(col, alpha);
}
`;

const GLOW_VERTEX = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const GLOW_FRAGMENT = /* glsl */ `
varying vec2 vUv;

void main() {
  float d = length(vUv - vec2(0.5)) * 2.0;
  float a = pow(max(1.0 - d, 0.0), 2.4);
  gl_FragColor = vec4(vec3(0.55, 0.6, 1.0), a * 0.4);
}
`;

/* ------------------------------------------------------------------ */
/* Shared singletons — module scope so geometry/materials are created  */
/* exactly once and reused (this module only ever runs client-side,    */
/* behind the dynamic ssr:false AuroraScene import).                   */
/* ------------------------------------------------------------------ */

/* Frozen-frame time: a phase where bands/rings/moons compose nicely */
const FROZEN_T = 26.0;

const PLANET_UNIFORMS = { uTime: { value: FROZEN_T } };
const RING_UNIFORMS = { uTime: { value: FROZEN_T } };
const SPARKLE_UNIFORMS = { uTime: { value: FROZEN_T } };
const MOON_A_UNIFORMS = { uTint: { value: new THREE.Color(0.3, 0.78, 0.72) } };
const MOON_B_UNIFORMS = { uTint: { value: new THREE.Color(0.78, 0.42, 0.85) } };

const SPHERE_GEOMETRY = new THREE.SphereGeometry(1, 48, 32);
const MOON_GEOMETRY = new THREE.IcosahedronGeometry(1, 1);
const RING_GEOMETRY = new THREE.RingGeometry(1.45, 2.6, 128, 1);
const GLOW_GEOMETRY = new THREE.PlaneGeometry(1, 1);

/* Shared trailing-glow material for both moons */
const GLOW_MATERIAL = new THREE.ShaderMaterial({
  vertexShader: GLOW_VERTEX,
  fragmentShader: GLOW_FRAGMENT,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

/* Deterministic PRNG — pure, stable sparkle distribution */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPARKLE_COUNT = 260;
const SPARKLE_BANDS: [number, number][] = [
  [1.5, 1.86],
  [1.97, 2.28],
  [2.36, 2.55],
];

function buildSparkleGeometry(): THREE.BufferGeometry {
  const random = mulberry32(20260777);
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(SPARKLE_COUNT * 3);
  const phases = new Float32Array(SPARKLE_COUNT);
  const sizes = new Float32Array(SPARKLE_COUNT);

  for (let i = 0; i < SPARKLE_COUNT; i += 1) {
    const band = SPARKLE_BANDS[i % SPARKLE_BANDS.length];
    const radius = band[0] + random() * (band[1] - band[0]);
    const angle = random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (random() - 0.5) * 0.06;
    phases[i] = random() * Math.PI * 2;
    sizes[i] = 0.3 + random() * 0.6;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  return geo;
}

const SPARKLE_GEOMETRY = buildSparkleGeometry();

/* Orbits (planet-local units) */
const MOON_A = { a: 3.3, b: 2.7, speed: 0.12, phase: 0.8, lag: 0.5 };
const MOON_B = { a: 4.0, b: 3.2, speed: -0.075, phase: 2.4, lag: -0.5 };

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PlanetModel({
  frozen = false,
}: {
  frozen?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const planetMatRef = useRef<THREE.ShaderMaterial>(null);
  const ringMatRef = useRef<THREE.ShaderMaterial>(null);
  const sparkleRef = useRef<THREE.Points>(null);
  const sparkleMatRef = useRef<THREE.ShaderMaterial>(null);
  const moonARef = useRef<THREE.Mesh>(null);
  const moonBRef = useRef<THREE.Mesh>(null);
  const glowARef = useRef<THREE.Mesh>(null);
  const glowBRef = useRef<THREE.Mesh>(null);
  const placedRef = useRef(false);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = frozen ? FROZEN_T : state.clock.elapsedTime + FROZEN_T;

    /* Time-driven shader uniforms */
    if (!frozen) {
      if (planetMatRef.current) {
        planetMatRef.current.uniforms.uTime.value = t;
      }
      if (ringMatRef.current) {
        ringMatRef.current.uniforms.uTime.value = t;
      }
      if (sparkleMatRef.current) {
        sparkleMatRef.current.uniforms.uTime.value = t;
      }
    }

    /* Responsive placement: upper-right of the hero viewport,
       smaller and tucked tighter on narrow screens. */
    const vw = state.viewport.width;
    const vh = state.viewport.height;
    const scale = THREE.MathUtils.clamp(vw * 0.085, 0.42, 0.85);
    group.scale.setScalar(scale);

    const baseX = vw / 2 - 2.3 * scale;
    const baseY = vh / 2 - 1.7 * scale + Math.sin(t * 0.22) * 0.07;

    if (frozen || !placedRef.current) {
      group.position.set(baseX, baseY, 0.6);
      placedRef.current = true;
    } else {
      /* Cheap pointer + scroll parallax, exponentially smoothed */
      const scroll = window.scrollY * 0.0012;
      const targetX = baseX + state.pointer.x * 0.16;
      const targetY = baseY + state.pointer.y * 0.1 + scroll;
      const k = Math.min(1, delta * 3);
      group.position.x += (targetX - group.position.x) * k;
      group.position.y += (targetY - group.position.y) * k;
      group.position.z = 0.6;
    }

    /* Slow axial rotation + ring sparkle drift */
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.05;
    }
    if (sparkleRef.current) {
      sparkleRef.current.rotation.z = t * 0.02;
    }

    /* Moons on inclined elliptical orbits, glow trailing behind */
    const thetaA = t * MOON_A.speed + MOON_A.phase;
    if (moonARef.current) {
      moonARef.current.position.set(
        Math.cos(thetaA) * MOON_A.a,
        Math.sin(thetaA) * MOON_A.b,
        0,
      );
      moonARef.current.rotation.y = t * 0.3;
      moonARef.current.rotation.z = t * 0.17;
    }
    if (glowARef.current) {
      glowARef.current.position.set(
        Math.cos(thetaA - MOON_A.lag) * MOON_A.a,
        Math.sin(thetaA - MOON_A.lag) * MOON_A.b,
        -0.02,
      );
    }

    const thetaB = t * MOON_B.speed + MOON_B.phase;
    if (moonBRef.current) {
      moonBRef.current.position.set(
        Math.cos(thetaB) * MOON_B.a,
        Math.sin(thetaB) * MOON_B.b,
        0,
      );
      moonBRef.current.rotation.y = -t * 0.24;
      moonBRef.current.rotation.x = t * 0.14;
    }
    if (glowBRef.current) {
      glowBRef.current.position.set(
        Math.cos(thetaB - MOON_B.lag) * MOON_B.a,
        Math.sin(thetaB - MOON_B.lag) * MOON_B.b,
        -0.02,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet */}
      <mesh
        ref={planetRef}
        geometry={SPHERE_GEOMETRY}
        rotation={[0, 0, 0.18]}
        renderOrder={0}
      >
        <shaderMaterial
          ref={planetMatRef}
          vertexShader={PLANET_VERTEX}
          fragmentShader={PLANET_FRAGMENT}
          uniforms={PLANET_UNIFORMS}
        />
      </mesh>

      {/* Atmosphere shell */}
      <mesh geometry={SPHERE_GEOMETRY} scale={1.18} renderOrder={2}>
        <shaderMaterial
          vertexShader={ATMO_VERTEX}
          fragmentShader={ATMO_FRAGMENT}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring system, tilted ~25° off horizontal */}
      <group rotation={[-1.13, 0, 0.25]}>
        <mesh geometry={RING_GEOMETRY} renderOrder={3}>
          <shaderMaterial
            ref={ringMatRef}
            vertexShader={RING_VERTEX}
            fragmentShader={RING_FRAGMENT}
            uniforms={RING_UNIFORMS}
            side={THREE.DoubleSide}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <points ref={sparkleRef} geometry={SPARKLE_GEOMETRY} renderOrder={4}>
          <shaderMaterial
            ref={sparkleMatRef}
            vertexShader={SPARKLE_VERTEX}
            fragmentShader={SPARKLE_FRAGMENT}
            uniforms={SPARKLE_UNIFORMS}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Moon A — teal glass gem on an inclined orbit */}
      <group rotation={[0.45, 0, 0.3]}>
        <mesh
          ref={glowARef}
          geometry={GLOW_GEOMETRY}
          material={GLOW_MATERIAL}
          scale={[0.8, 0.8, 1]}
          renderOrder={3}
        />
        <mesh
          ref={moonARef}
          geometry={MOON_GEOMETRY}
          scale={0.17}
          renderOrder={4}
        >
          <shaderMaterial
            vertexShader={MOON_VERTEX}
            fragmentShader={MOON_FRAGMENT}
            uniforms={MOON_A_UNIFORMS}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Moon B — magenta glass gem, counter-rotating, wider orbit */}
      <group rotation={[-0.55, 0, -0.4]}>
        <mesh
          ref={glowBRef}
          geometry={GLOW_GEOMETRY}
          material={GLOW_MATERIAL}
          scale={[0.55, 0.55, 1]}
          renderOrder={3}
        />
        <mesh
          ref={moonBRef}
          geometry={MOON_GEOMETRY}
          scale={0.11}
          renderOrder={4}
        >
          <shaderMaterial
            vertexShader={MOON_VERTEX}
            fragmentShader={MOON_FRAGMENT}
            uniforms={MOON_B_UNIFORMS}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
