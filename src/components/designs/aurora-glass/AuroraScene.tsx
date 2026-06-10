"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PlanetModel from "./PlanetModel";

/* ------------------------------------------------------------------ */
/* GLSL                                                                */
/* ------------------------------------------------------------------ */

const AURORA_VERTEX = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const AURORA_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;

/* --- Ashima 3D simplex noise --- */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float f = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    f += amp * snoise(p);
    p *= 2.04;
    amp *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = vUv;
  vec2 p = vec2(uv.x * uAspect, uv.y) * 1.55;
  float t = uTime * 0.045;

  /* Domain-warped fbm: slow, organic aurora curtains */
  vec2 q = vec2(
    fbm(vec3(p, t)),
    fbm(vec3(p + vec2(3.1, 1.7), t + 4.0))
  );
  vec2 r = vec2(
    fbm(vec3(p + 1.8 * q + vec2(1.7, 9.2), t * 1.25)),
    fbm(vec3(p + 1.8 * q + vec2(8.3, 2.8), t * 0.85))
  );
  float f = fbm(vec3(p + 1.6 * r, t * 0.9));

  float glow = smoothstep(-0.42, 0.85, f);

  vec3 base    = vec3(0.027, 0.020, 0.063); /* #070510 deep space */
  vec3 teal    = vec3(0.075, 0.66, 0.60);
  vec3 indigo  = vec3(0.27, 0.32, 0.92);
  vec3 magenta = vec3(0.83, 0.27, 0.73);
  vec3 violet  = vec3(0.57, 0.44, 0.98);

  vec3 colA = mix(teal, indigo, clamp(q.x * 0.5 + 0.5, 0.0, 1.0));
  vec3 colB = mix(magenta, violet, clamp(r.y * 0.5 + 0.5, 0.0, 1.0));
  vec3 aurora = mix(colA, colB, clamp(f * 0.5 + 0.5, 0.0, 1.0));

  float intensity = pow(glow, 2.3) * 0.6;

  /* A thin brighter ribbon weaving through the field */
  float ribbon = smoothstep(0.22, 0.0, abs(f - 0.16)) * 0.16;

  vec3 color = base + aurora * intensity + aurora * ribbon;

  /* Vignette for depth */
  vec2 c = uv - 0.5;
  color *= 1.0 - dot(c, c) * 0.65;

  /* Dither to kill banding on the dark gradient */
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  color += dither;

  gl_FragColor = vec4(color, 1.0);
}
`;

const STAR_VERTEX = /* glsl */ `
attribute float aPhase;
attribute float aSize;
uniform float uTime;
varying float vAlpha;

void main() {
  /* Gentle per-star twinkle */
  vAlpha = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * 0.7 + aPhase));
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (26.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const STAR_FRAGMENT = /* glsl */ `
varying float vAlpha;

void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float a = smoothstep(0.5, 0.05, length(d));
  gl_FragColor = vec4(vec3(0.85, 0.88, 1.0), a * vAlpha * 0.85);
}
`;

/* ------------------------------------------------------------------ */
/* Stable uniform objects (single canvas instance per page)            */
/* ------------------------------------------------------------------ */

const AURORA_UNIFORMS = {
  uTime: { value: 12.0 },
  uAspect: { value: 1.0 },
};

const STAR_UNIFORMS = {
  uTime: { value: 0.0 },
};

/* Deterministic PRNG so the starfield is pure & stable across renders */
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

/* ------------------------------------------------------------------ */
/* Scene pieces                                                        */
/* ------------------------------------------------------------------ */

function AuroraPlane({ frozen }: { frozen: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    if (!frozen) {
      material.uniforms.uTime.value = state.clock.elapsedTime + 12.0;
    }
    material.uniforms.uAspect.value = state.viewport.aspect;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={AURORA_VERTEX}
        fragmentShader={AURORA_FRAGMENT}
        uniforms={AURORA_UNIFORMS}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

const STAR_COUNT = 1500;

function Starfield({ frozen }: { frozen: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const random = mulberry32(20260610);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const phases = new Float32Array(STAR_COUNT);
    const sizes = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i += 1) {
      positions[i * 3] = (random() - 0.5) * 26;
      positions[i * 3 + 1] = (random() - 0.5) * 16;
      positions[i * 3 + 2] = -random() * 6 - 0.5;
      phases[i] = random() * Math.PI * 2;
      sizes[i] = 0.5 + random() * 1.4;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material || frozen) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points geometry={geometry} renderOrder={1}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={STAR_VERTEX}
        fragmentShader={STAR_FRAGMENT}
        uniforms={STAR_UNIFORMS}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas root (loaded via next/dynamic, ssr: false)                   */
/* ------------------------------------------------------------------ */

export default function AuroraScene({
  frozen = false,
}: {
  frozen?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={frozen ? "demand" : "always"}
      camera={{ position: [0, 0, 5], fov: 55 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <color attach="background" args={["#070510"]} />
      <AuroraPlane frozen={frozen} />
      <Starfield frozen={frozen} />
      <PlanetModel frozen={frozen} />
    </Canvas>
  );
}
