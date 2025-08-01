import * as THREE from "three";
import {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import {
  COLOR_MAP,
  FACE_TO_MATERIAL_INDEX,
  FACE_ROTATION_MAP,
  type FaceColor,
  CUBE_FACE_ORDER,
  STICKER_MAP,
  CUBE_COLOR_LETTER,
  faceMap,
} from "../utils/cubeConstants";
import {
  layerFilter,
  rotatePosition,
  rotateOrientation,
  getAnimatedCubies,
  getDefaultCubies,
} from "../utils/cubeUtils";
import { Cubie } from "./Cubie";
import type { CubieType } from "../utils/cubeTypes";

const Cube3D = forwardRef(function Cube3D(
  { animationSpeed = 1 }: { animationSpeed?: number },
  ref
) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMove, setCurrentMove] = useState<string | null>(null);
  // CubieType增加orientation属性，初始为[0,0,0]
  const [cubies, setCubies] = useState<CubieType[]>(
    getDefaultCubies().map((cubie) => ({ ...cubie, orientation: [0, 0, 0] }))
  );
  const onAnimationEndCallbackRef = useRef<(() => void) | null>(null);

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

  // 物理+数学：旋转时 position 和 orientation 都变换（工具函数抽离）
  const rotateCubies = (move: string) => {
    const face = move[0].toUpperCase() as FaceColor;
    const isPrime = move.endsWith("'");
    const filterFn = layerFilter[face as keyof typeof layerFilter];
    const rot = FACE_ROTATION_MAP[face];
    if (!filterFn || !rot) return;
    const axis = rot.axis;
    const angle = isPrime ? rot.ccw : rot.cw;
    setCubies((prev) => {
      return prev.map((cubie) => {
        if (!filterFn(cubie)) return cubie;
        return {
          ...cubie,
          position: rotatePosition(cubie.position, axis, angle),
          orientation: rotateOrientation(
            cubie.orientation || [0, 0, 0],
            axis,
            angle
          ),
        };
      });
    });
  };

  const [springs, api] = useSpring(() => ({
    rotation: [0, 0, 0] as [number, number, number],
    config: {
      tension: 120,
      friction: 14,
      precision: 0.0001,
    },
    onRest: () => {
      console.log("Animation completed, calling onRest");
      setIsAnimating(false);
      setCurrentMove(null);
      api.set({ rotation: [0, 0, 0] });
      if (onAnimationEndCallbackRef.current) {
        const callback = onAnimationEndCallbackRef.current;
        onAnimationEndCallbackRef.current = null;
        callback();
      }
    },
  }));

  // 动画触发：分层Cubie整体搬移
  const triggerLayerRotate = (move: string, onEnd?: () => void) => {
    if (isAnimating) {
      if (onEnd) setTimeout(onEnd, 100);
      return;
    }
    setIsAnimating(true);
    setCurrentMove(move);
    onAnimationEndCallbackRef.current = () => {
      rotateCubies(move);
      if (onEnd) onEnd();
    };
    // 动画参数（统一用 FACE_ROTATION_MAP）
    const face = move[0].toUpperCase() as FaceColor;
    const isPrime = move.endsWith("'");
    const rot = FACE_ROTATION_MAP[face];
    const axis = rot ? rot.axis : [0, 1, 0];
    const angle = rot ? (isPrime ? rot.ccw : rot.cw) : Math.PI / 2;
    const rotation: [number, number, number] = [0, 0, 0];
    if (axis[0]) rotation[0] = angle * axis[0];
    if (axis[1]) rotation[1] = angle * axis[1];
    if (axis[2]) rotation[2] = angle * axis[2];
    setTimeout(() => {
      api.start({
        to: { rotation },
        from: { rotation: [0, 0, 0] },
        config: { duration: 300 / animationSpeed },
      });
    }, 10);
  };

  // 获取魔方当前物理状态字符串
  // 映射前端顺序和颜色到后端风格
  const getCubeState = () => {
    // 统一用STICKER_MAP顺序采集所有面贴纸，保证与后端一致
    let state = "";
    for (const face of CUBE_FACE_ORDER) {
      const positions = STICKER_MAP.filter((s) => s.f === face).map((s) => s.p);
      for (const pos of positions) {
        const cubie = cubies.find(
          (c) =>
            Math.round(c.position[0]) === pos[0] &&
            Math.round(c.position[1]) === pos[1] &&
            Math.round(c.position[2]) === pos[2]
        );
        if (!cubie) {
          state += "X";
          continue;
        }
        let foundSticker: string | undefined;
        for (const stickerFace in cubie.stickers) {
          const faceVecs: Record<FaceColor, [number, number, number]> = {
            U: [0, 1, 0],
            D: [0, -1, 0],
            F: [0, 0, 1],
            B: [0, 0, -1],
            R: [1, 0, 0],
            L: [-1, 0, 0],
          };
          const vec = new THREE.Vector3(...faceVecs[stickerFace as FaceColor]);
          const euler = new THREE.Euler(...(cubie.orientation || [0, 0, 0]));
          vec.applyEuler(euler);
          const faceVec = new THREE.Vector3(...faceVecs[face]);
          if (vec.distanceTo(faceVec) < 0.1) {
            foundSticker = cubie.stickers[stickerFace as FaceColor];
            break;
          }
        }
        if (foundSticker) {
          state += CUBE_COLOR_LETTER[foundSticker] || foundSticker[0];
        } else {
          state += "X";
        }
      }
    }

    // 按后端顺序重组
    let backendState = "";
    let idx = 0;
    for (const face of CUBE_FACE_ORDER) {
      backendState += state
        .slice(idx, idx + 9)
        .split("")
        .map((c) => faceMap[c] || c)
        .join("");
      idx += 9;
    }
    return backendState;
  };

  useImperativeHandle(ref, () => ({ triggerLayerRotate, getCubeState }));

  // Cubie对象直接分组
  const cubieList = cubies;
  // 极简：分层动画分组（工具函数）
  const animatedCubies: CubieType[] = currentMove
    ? getAnimatedCubies(currentMove, cubieList)
    : [];
  const staticCubies = currentMove
    ? cubieList.filter((cubie) => !animatedCubies.includes(cubie))
    : cubieList;

  // Cubie渲染：根据自身贴纸生成材质
  const getCubieMaterials = (cubie: CubieType) => {
    const mats: THREE.Material[] = Array(6).fill(colorMaterials["default"]);
    Object.entries(cubie.stickers).forEach(([face, color]) => {
      const idx = FACE_TO_MATERIAL_INDEX[face as FaceColor];
      mats[idx] = colorMaterials[color] || colorMaterials["default"];
    });
    return mats;
  };

  return (
    <div style={{ width: "100%", height: "100%", touchAction: "none" }}>
      <Canvas camera={{ position: [3.5, 3.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <animated.group rotation={springs.rotation as any}>
          {animatedCubies.map((cubie) => (
            <Cubie
              key={`animated-${cubie.id}`}
              position={cubie.position}
              orientation={cubie.orientation}
              materials={getCubieMaterials(cubie)}
            />
          ))}
        </animated.group>
        <group>
          {staticCubies.map((cubie) => (
            <Cubie
              key={`static-${cubie.id}`}
              position={cubie.position}
              orientation={cubie.orientation}
              materials={getCubieMaterials(cubie)}
            />
          ))}
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
