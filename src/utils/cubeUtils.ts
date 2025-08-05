// CubieType 类型和工厂函数
import { STICKER_MAP } from "./cubeConstants";
import type { FaceColor } from "./cubeConstants";
import * as THREE from "three";
import {
  CUBE_FACE_ORDER,
  CUBE_COLOR_LETTER,
  faceMap,
} from "./cubeConstants";
import type { CubieType } from "./cubeTypes";


// 以STICKER_MAP为唯一数据源
export function getDefaultCubies(): CubieType[] {
  const cubieMap = new Map<string, CubieType>();
  for (const sticker of STICKER_MAP) {
    const key = JSON.stringify(sticker.p);
    if (!cubieMap.has(key)) {
      cubieMap.set(key, {
        id: `cubie-${key}`,
        position: sticker.p as [number, number, number],
        stickers: {},
      });
    }
    cubieMap.get(key)!.stickers[sticker.f as FaceColor] = sticker.f;
  }
  return Array.from(cubieMap.values());
}

// 分层筛选器
export const layerFilter = {
  U: (c: CubieType) => c.position[1] === 1,
  D: (c: CubieType) => c.position[1] === -1,
  F: (c: CubieType) => c.position[2] === 1,
  B: (c: CubieType) => c.position[2] === -1,
  R: (c: CubieType) => c.position[0] === 1,
  L: (c: CubieType) => c.position[0] === -1,
};


export function rotatePosition(
  pos: [number, number, number],
  axis: [number, number, number],
  angle: number
): [number, number, number] {
  const v = new THREE.Vector3(...pos);
  const q = new THREE.Quaternion();
  q.setFromAxisAngle(new THREE.Vector3(...axis), angle);
  v.applyQuaternion(q);
  return [Math.round(v.x), Math.round(v.y), Math.round(v.z)];
}

export function rotateOrientation(
  ori: [number, number, number],
  axis: [number, number, number],
  angle: number
): [number, number, number] {
  const euler = new THREE.Euler(...ori);
  const q = new THREE.Quaternion().setFromEuler(euler);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(...axis), angle);
  q.premultiply(q2);
  const newEuler = new THREE.Euler().setFromQuaternion(q);
  return [newEuler.x, newEuler.y, newEuler.z];
}

export function getAnimatedCubies(move: string | null, cubieList: CubieType[]): CubieType[] {
  if (!move) return [];
  const m = move[0].toUpperCase();
  const filterFn = layerFilter[m as keyof typeof layerFilter];
  if (!filterFn) return [];
  return cubieList.filter(filterFn);
}



// 获取魔方当前物理状态字符串（前端采集，后端兼容）
export function getCubeStateFromCubies(cubies: CubieType[]): string {
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
}
