// CubieType 类型和工厂函数
import { STICKER_MAP } from "./cubeConstants";
import type { FaceColor } from "./cubeConstants";


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
import * as THREE from "three";
import type { CubieType } from "./cubeTypes";

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
