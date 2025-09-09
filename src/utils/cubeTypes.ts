// 魔方颜色类型
export type Color = 'W' | 'Y' | 'R' | 'O' | 'G' | 'B';

// 解魔方阶段类型
export interface SolvingStage {
    id: string;
    name: string;
    description: string;
    targetPattern: string;
    hints: string[];
    algorithm?: string[];
    cubeProgress: string[];
}

// 魔方状态类型
export interface CubeState {
    raw: string;        // 54字符的状态字符串
    isSolved: boolean;
}
export type FaceColor = "U" | "R" | "F" | "D" | "L" | "B";

export type CubieKind = "corner" | "edge" | "center";

export type CubieType = {
    id: string;
    position: [number, number, number];
    stickers: Partial<Record<FaceColor, string>>;
    orientation?: [number, number, number];
    type: CubieKind;
};
