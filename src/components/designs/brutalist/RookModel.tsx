"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Mesh, MeshStandardMaterial } from "three";

const ROOK_URL = "/models/rook_concrete.glb";

/**
 * GLB is Y-up with base at y = 0. The CAD exporter converts mm to meters,
 * so the model is ~0.11 x 0.186 x 0.11 glTF units. 31x puts the crown at
 * ~5.8 scene units — monumental against the 2048px hard-shadow key light
 * without escaping the frame.
 */
const ROOK_SCALE = 31;
const GROUND_Y = -2.15; // matches the ground slab in MonolithScene

export default function RookModel() {
  const { scene } = useGLTF(ROOK_URL);

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
    <primitive object={rook} position={[0, GROUND_Y, 0]} scale={ROOK_SCALE} />
  );
}

useGLTF.preload(ROOK_URL);
