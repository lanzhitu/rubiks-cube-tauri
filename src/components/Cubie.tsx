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
  ({
    position,
    orientation = [0, 0, 0],
    materials,
    cubieType,
  }: CubieProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    let typeText = "";
    if (cubieType === "corner") typeText = "角块";
    else if (cubieType === "edge") typeText = "棱块";
    else if (cubieType === "center") typeText = "中块";

    return (
      <group position={position} rotation={orientation}>
        <mesh ref={meshRef} material={materials}>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
        </mesh>
      </group>
    );
  }
);
