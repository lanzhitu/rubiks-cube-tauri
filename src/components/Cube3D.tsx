import * as THREE from "three";
import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { animated } from "@react-spring/three";
import {
  COLOR_MAP,
  FACE_TO_MATERIAL_INDEX,
  type FaceColor,
} from "../utils/cubeConstants";
import { getCubeStateFromCubies } from "../utils/cubeUtils";
import { useCubeAnimation } from "../hooks/useCubeAnimation";
import type { CubieType } from "../utils/cubeTypes";
import { CubieList } from "./CubieList";

const Cube3D = forwardRef(function Cube3D(
  { animationSpeed = 1 }: { animationSpeed?: number },
  ref
) {
  // 使用自定义 Hook 管理动画和 Cubie 状态
  const {
    cubies,
    animatedCubies,
    staticCubies,
    springs,
    triggerLayerRotate,
    triggerCubeRotate,
    isAnimating,
  } = useCubeAnimation(animationSpeed);

  // 生成贴纸材质
  const colorMaterials = useMemo(() => {
    const materials: Record<string, THREE.MeshBasicMaterial> = {};
    for (const key in COLOR_MAP) {
      materials[key] = new THREE.MeshBasicMaterial({
        color: COLOR_MAP[key],
        side: THREE.DoubleSide,
      });
    }
    materials["default"] = new THREE.MeshBasicMaterial({ color: "#222" });
    return materials;
  }, []);

  // Cubie渲染：根据自身贴纸生成材质
  const getCubieMaterials = (cubie: CubieType) => {
    const mats: THREE.Material[] = Array(6).fill(colorMaterials["default"]);
    Object.entries(cubie.stickers).forEach(([face, color]) => {
      const idx = FACE_TO_MATERIAL_INDEX[face as FaceColor];
      mats[idx] = colorMaterials[color] || colorMaterials["default"];
    });
    return mats;
  };

  // 获取魔方当前物理状态字符串（工具函数调用）
  const getCubeState = () => {
    return getCubeStateFromCubies(cubies);
  };

  useImperativeHandle(ref, () => ({
    triggerLayerRotate,
    getCubeState,
    triggerCubeRotate,
    isAnimating,
  }));

  // 调试输出
  console.log("[Cube3D] springs.rotation:", springs.rotation);
  console.log("[Cube3D] animatedCubies:", animatedCubies);
  console.log("[Cube3D] staticCubies:", staticCubies);
  return (
    <div style={{ width: "100%", height: "100%", touchAction: "none" }}>
      <Canvas camera={{ position: [3.5, 3.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <animated.group rotation={springs.rotation as any}>
          {/* 动画组调试 */}
          <CubieList
            cubies={animatedCubies}
            getCubieMaterials={getCubieMaterials}
            prefix="animated"
          />
        </animated.group>
        <group>
          {/* 静态组调试 */}
          <CubieList
            cubies={staticCubies}
            getCubieMaterials={getCubieMaterials}
            prefix="static"
          />
        </group>
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          enableDamping={true}
          dampingFactor={0.1}
        />
      </Canvas>
    </div>
  );
});

export default Cube3D;
