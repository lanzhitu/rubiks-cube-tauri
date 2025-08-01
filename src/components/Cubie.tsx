import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export type CubieProps = {
  position: [number, number, number];
  orientation?: [number, number, number];
  materials: THREE.Material[];
};

export const Cubie = React.memo(
  ({ position, orientation = [0, 0, 0], materials }: CubieProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useEffect(() => {
      // 可选：处理 meshRef 相关逻辑
    }, [position, orientation]);
    return (
      <mesh
        ref={meshRef}
        position={position}
        rotation={orientation}
        material={materials}
      >
        <boxGeometry args={[0.95, 0.95, 0.95]} />
      </mesh>
    );
  }
);
