import * as THREE from "three";
import React from "react";
import { useMemo, forwardRef, useImperativeHandle, useRef } from "react";
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
import InfoPanelOverlay from "./InfoPanelOverlay";
import theme from "../styles/theme";

const Cube3D = forwardRef(function Cube3D(
  { animationSpeed = 1 }: { animationSpeed?: number },
  ref
) {
  const [interactiveMode, setInteractiveMode] = React.useState(false);
  // 使用自定义 Hook 管理动画和 Cubie 状态
  const {
    cubies,
    animatedCubies,
    staticCubies,
    springs,
    isAnimating,
    triggerRotate,
  } = useCubeAnimation(animationSpeed);

  const controlsRef = useRef<any>(null);

  // 翻转相机位置
  const flipCamera = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      if (camera.up.y > 0) {
        camera.up.set(0, -1, 0);
      } else {
        camera.up.set(0, 1, 0);
      }
      camera.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  };

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
    if (!interactiveMode) {
      // 正常模式只显示贴纸颜色
      return mats;
    }
    // 交互模式下直接覆盖贴纸色为高亮色
    let highlightColor = null;
    if (cubie.type === "corner") {
      highlightColor = theme.highlightCorner || theme.accent;
    } else if (cubie.type === "edge") {
      highlightColor = theme.highlightEdge || theme.primary;
    } else if (cubie.type === "center") {
      highlightColor = theme.highlightCenter || "#FFD600";
    }
    if (highlightColor) {
      return Array(6).fill(
        new THREE.MeshBasicMaterial({ color: highlightColor })
      );
    }
    return mats;
  };

  // 获取魔方当前物理状态字符串（工具函数调用）
  const getCubeState = () => {
    return getCubeStateFromCubies(cubies);
  };

  useImperativeHandle(ref, () => ({
    getCubeState,
    triggerRotate,
    isAnimating,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        touchAction: "none",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1001 }}>
        <button
          onClick={() => setInteractiveMode((m) => !m)}
          style={{
            padding: "8px 16px",
            backgroundColor: interactiveMode ? theme.primary : theme.surface,
            color: theme.textPrimary,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            marginRight: "10px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 15,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {interactiveMode ? "正常模式" : "说明模式"}
        </button>
        <button
          onClick={flipCamera}
          style={{
            padding: "8px 16px",
            backgroundColor: theme.accent,
            color: theme.background,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 15,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          翻转相机
        </button>
      </div>
      {/* 信息弹窗及按钮 */}
      {interactiveMode && <InfoPanelOverlay />}
      <Canvas camera={{ position: [3.5, 3.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <animated.group
          rotation={springs.rotation as any}
          scale={[0.7, 0.7, 0.7]}
        >
          {/* 动画组调试 */}
          <CubieList
            cubies={animatedCubies}
            getCubieMaterials={getCubieMaterials}
            prefix="animated"
            interactiveMode={interactiveMode}
          />
        </animated.group>
        <group scale={[0.7, 0.7, 0.7]}>
          {/* 静态组调试 */}
          <CubieList
            cubies={staticCubies}
            getCubieMaterials={getCubieMaterials}
            prefix="static"
            interactiveMode={interactiveMode}
          />
        </group>
        <OrbitControls
          ref={controlsRef}
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
