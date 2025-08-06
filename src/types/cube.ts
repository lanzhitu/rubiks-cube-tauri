// 魔方的类型定义
export type Move = string;  // 基础移动，如 "U", "R'", "F2" 等
export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
export type Color = 'W' | 'Y' | 'R' | 'O' | 'G' | 'B';

// 解魔方的步骤定义
export interface SolvingStep {
    id: string;
    name: string;
    description: string;
    algorithm?: string[];
    targetPattern: string;
    hints: string[];
}

// 解魔方的阶段定义
export interface SolvingStage {
    id: string;
    name: string;
    description: string;
    steps: SolvingStep[];
}

// 魔方状态
export interface CubeState {
    raw: string;        // 54字符的状态字符串
    faces: Color[][];   // 6个面的颜色矩阵
    isSolved: boolean;
}

// 魔方动作结果
export interface MoveResult {
    success: boolean;
    newState?: string;
    error?: string;
}
