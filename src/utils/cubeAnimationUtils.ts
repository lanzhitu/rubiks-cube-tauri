// cubeAnimationUtils.ts
// 极简且易读的魔方动画工具函数
import type { CubieType } from "./cubeTypes";
import { rotatePosition, rotateOrientation } from "./cubeUtils";
import { FACE_ROTATION_MAP, type FaceColor } from "./cubeConstants";
import { layerFilter } from "./cubeUtils";

export function getRotationParams(move: string): { axis: [number, number, number], angle: number } {
    if (["X", "Y", "Z"].includes(move)) {
        const axis: [number, number, number] = move === "X" ? [1, 0, 0] : move === "Y" ? [0, 1, 0] : [0, 0, 1];
        return { axis, angle: -Math.PI / 2 };
    }
    const face = move[0].toUpperCase() as FaceColor;
    const isPrime = move.endsWith("'");
    const rot = FACE_ROTATION_MAP[face];
    if (!rot) return { axis: [0, 1, 0], angle: Math.PI / 2 };
    return { axis: rot.axis, angle: isPrime ? rot.ccw : rot.cw };
}

export function rotateCubies(cubies: CubieType[], move: string): CubieType[] {
    const { axis, angle } = getRotationParams(move);
    if (["X", "Y", "Z"].includes(move)) {
        return cubies.map(cubie => ({
            ...cubie,
            position: rotatePosition(cubie.position, axis, angle),
            orientation: rotateOrientation(cubie.orientation || [0, 0, 0], axis, angle),
        }));
    }
    const face = move[0].toUpperCase() as FaceColor;
    const filterFn = layerFilter[face as keyof typeof layerFilter];
    if (!filterFn) return cubies;
    return cubies.map(cubie => {
        if (!filterFn(cubie)) return cubie;
        return {
            ...cubie,
            position: rotatePosition(cubie.position, axis, angle),
            orientation: rotateOrientation(cubie.orientation || [0, 0, 0], axis, angle),
        };
    });
}
