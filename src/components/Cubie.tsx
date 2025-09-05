import React, { useRef } from "react";
import * as THREE from "three";
import type { CubieKind, FaceColor } from "../utils/cubeTypes";

export type CubieProps = {
  position: [number, number, number];
  orientation?: [number, number, number];
  materials: THREE.Material[];
  interactiveMode?: boolean;
  cubieType?: CubieKind;
  stickers?: Partial<Record<FaceColor, string>>;
};

export const Cubie = React.memo(
  ({ position, orientation = [0, 0, 0], materials }: CubieProps) => {
    const meshRef = useRef<THREE.Mesh>(null);

    return (
      <group position={position} rotation={orientation}>
        <mesh ref={meshRef} material={materials}>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
        </mesh>
      </group>
    );
  }
);
