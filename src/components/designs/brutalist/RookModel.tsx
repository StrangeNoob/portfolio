"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Mesh, MeshStandardMaterial } from "three";

const ROOK_URL = "/models/rook_concrete.glb";

/**
 * GLB is Y-up with base at y = 0. The CAD exporter converts mm to meters,
 * so the model is ~0.11 x 0.186 x 0.11 glTF units. 31x puts the crown at
 * ~5.8 scene units — monumental against the 2048px hard-shadow key light
 * without escaping the frame on desktop. Narrow viewports crop the frame
 * horizontally (fixed vertical fov), so the monument scales down with
 * width to stay a backdrop instead of swallowing the hero.
 */
function rookScale(width: number): number {
  if (width < 480) return 17;
  if (width < 768) return 22;
  if (width < 1100) return 26;
  return 31;
}
const GROUND_Y = -2.15; // matches the ground slab in MonolithScene

export default function RookModel() {
  const { scene } = useGLTF(ROOK_URL);
  const width = useThree((s) => s.size.width);
  const scale = rookScale(width);

  const rook = useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        for (const mat of materials) {
          if (mat instanceof MeshStandardMaterial) {
            // The signal-red doorway keeps a tighter sheen;
            // everything else goes dead-matte concrete.
            const isSignalRed =
              mat.color.r > 0.5 && mat.color.g < 0.35 && mat.color.b < 0.35;
            mat.roughness = isSignalRed ? 0.6 : 0.95;
            mat.metalness = 0;
          }
        }
      }
    });
    return scene;
  }, [scene]);

  return (
    <primitive object={rook} position={[0, GROUND_Y, 0]} scale={scale} />
  );
}

useGLTF.preload(ROOK_URL);
