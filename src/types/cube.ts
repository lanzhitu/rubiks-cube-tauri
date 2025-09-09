// 魔方的类型定义
// 定义魔方的颜色
export type Color = 'W' | 'Y' | 'R' | 'O' | 'G' | 'B';

// 解魔方的阶段定义
export interface SolvingStage {
    id: string;
    name: string;
    description: string;
    targetPattern: string;
    hints: string[];
    algorithm?: string[];
    cubeProgress: string[];
}

// 魔方状态
export interface CubeState {
    raw: string;        // 54字符的状态字符串
    isSolved: boolean;
}
