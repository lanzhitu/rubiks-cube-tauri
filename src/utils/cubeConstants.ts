// 魔方面顺时针/逆时针旋转物理映射
export const FACE_ROTATION_MAP: Record<FaceColor, { axis: [number, number, number]; cw: number; ccw: number }> = {
    U: { axis: [0, 1, 0], cw: -Math.PI / 2, ccw: Math.PI / 2 }, // 顶
    D: { axis: [0, 1, 0], cw: Math.PI / 2, ccw: -Math.PI / 2 }, // 底
    L: { axis: [1, 0, 0], cw: Math.PI / 2, ccw: -Math.PI / 2 }, // 左
    R: { axis: [1, 0, 0], cw: -Math.PI / 2, ccw: Math.PI / 2 }, // 右
    F: { axis: [0, 0, 1], cw: -Math.PI / 2, ccw: Math.PI / 2 }, // 前
    B: { axis: [0, 0, 1], cw: Math.PI / 2, ccw: -Math.PI / 2 }, // 后
};

export const CUBE_COLOR_LETTER: Record<string, string> = {
    W: "W", O: "O", G: "G", R: "R", B: "B", Y: "Y",
    white: "W", orange: "O", green: "G", red: "R", blue: "B", yellow: "Y",
};
export type FaceColor = "U" | "R" | "F" | "D" | "L" | "B";

export const COLOR_MAP: Record<string, string> = {
    U: "#ffffff", D: "#ffff00", F: "#00ff00", B: "#0000ff",
    L: "#ff8000", R: "#ff0000", default: "#222222"
};

export const FACE_TO_MATERIAL_INDEX: Record<string, number> = {
    R: 0, L: 1, U: 2, D: 3, F: 4, B: 5
};

export function getCubeletIndex(x: number, y: number, z: number): number {
    const mapCoord = (coord: number) => coord + 1;
    return mapCoord(x) + mapCoord(y) * 3 + mapCoord(z) * 9;
}


export const STICKER_MAP = [
    // U face (0-8)
    { p: [-1, 1, -1], f: "U" },
    { p: [0, 1, -1], f: "U" },
    { p: [1, 1, -1], f: "U" },
    { p: [-1, 1, 0], f: "U" },
    { p: [0, 1, 0], f: "U" },
    { p: [1, 1, 0], f: "U" },
    { p: [-1, 1, 1], f: "U" },
    { p: [0, 1, 1], f: "U" },
    { p: [1, 1, 1], f: "U" },
    // R face (9-17)
    { p: [1, 1, 1], f: "R" },
    { p: [1, 1, 0], f: "R" },
    { p: [1, 1, -1], f: "R" },
    { p: [1, 0, 1], f: "R" },
    { p: [1, 0, 0], f: "R" },
    { p: [1, 0, -1], f: "R" },
    { p: [1, -1, 1], f: "R" },
    { p: [1, -1, 0], f: "R" },
    { p: [1, -1, -1], f: "R" },
    // F face (18-26)
    { p: [-1, 1, 1], f: "F" },
    { p: [0, 1, 1], f: "F" },
    { p: [1, 1, 1], f: "F" },
    { p: [-1, 0, 1], f: "F" },
    { p: [0, 0, 1], f: "F" },
    { p: [1, 0, 1], f: "F" },
    { p: [-1, -1, 1], f: "F" },
    { p: [0, -1, 1], f: "F" },
    { p: [1, -1, 1], f: "F" },
    // D face (27-35) - 顺序与后端一致：z从1到-1，x从-1到1，y=-1
    { p: [-1, -1, 1], f: "D" },
    { p: [0, -1, 1], f: "D" },
    { p: [1, -1, 1], f: "D" },
    { p: [-1, -1, 0], f: "D" },
    { p: [0, -1, 0], f: "D" },
    { p: [1, -1, 0], f: "D" },
    { p: [-1, -1, -1], f: "D" },
    { p: [0, -1, -1], f: "D" },
    { p: [1, -1, -1], f: "D" },
    // L face (36-44) - 顺序reverse，保证与后端一致
    { p: [-1, 1, -1], f: "L" },
    { p: [-1, 1, 0], f: "L" },
    { p: [-1, 1, 1], f: "L" },
    { p: [-1, 0, -1], f: "L" },
    { p: [-1, 0, 0], f: "L" },
    { p: [-1, 0, 1], f: "L" },
    { p: [-1, -1, -1], f: "L" },
    { p: [-1, -1, 0], f: "L" },
    { p: [-1, -1, 1], f: "L" },
    // B face (45-53)
    { p: [1, 1, -1], f: "B" },
    { p: [0, 1, -1], f: "B" },
    { p: [-1, 1, -1], f: "B" },
    { p: [1, 0, -1], f: "B" },
    { p: [0, 0, -1], f: "B" },
    { p: [-1, 0, -1], f: "B" },
    { p: [1, -1, -1], f: "B" },
    { p: [0, -1, -1], f: "B" },
    { p: [-1, -1, -1], f: "B" },
];

export const faceMap: Record<string, string> = {
    U: "W", // White
    L: "O", // Orange
    F: "G", // Green
    R: "R", // Red
    B: "B", // Blue
    D: "Y", // Yellow
};
