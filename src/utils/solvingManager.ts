import { SOLVING_STAGES } from '../constants/solvingStage';
import type { CubeState, SolvingStage } from '../types/cube';

export interface GuideInfo {
    progress: string[];
    currentStage: number;
    totalStages: number;
    nextMove: string;
    description: string;
}

export const ManagerState = {
    SCRAMBLING: 'SCRAMBLING',
    SOLVING: 'SOLVING'
} as const;

type ManagerStateType = typeof ManagerState[keyof typeof ManagerState];

export class SolvingManager {
    private currentStageIndex: number = 0;
    private stageProgress: boolean[] = [];
    private lastState: CubeState | undefined;
    private state: ManagerStateType = ManagerState.SOLVING; // 使用状态常量

    constructor() {
        this.reset();
    }

    // 设置当前状态
    setState(newState: ManagerStateType): void {
        this.state = newState;
    }

    // 重置状态
    reset(): void {
        this.currentStageIndex = 0;
        this.stageProgress = new Array(SOLVING_STAGES.length).fill(false);
        this.lastState = undefined;
        this.state = ManagerState.SOLVING; // 默认切换到解题模式
    }

    // 获取当前阶段
    getCurrentStage(): SolvingStage {
        return SOLVING_STAGES[this.currentStageIndex];
    }

    // 检查阶段是否完成
    isStageComplete(): boolean {
        const currentStage = this.getCurrentStage();
        return this.matchesPattern(this.lastState?.raw || '', currentStage.targetPattern);
    }

    // 获取当前提示
    getCurrentHints(): string[] {
        return this.getCurrentStage().hints;
    }

    // 获取当前推荐动作
    getCurrentMoves(): string[] {
        const stage = this.getCurrentStage();
        return stage.algorithm || [];
    }

    // 计算总体进度
    getProgress(): number {
        const completedStages = this.stageProgress.filter(done => done).length;
        return (completedStages / SOLVING_STAGES.length) * 100;
    }

    // 移动到下一个阶段
    moveToNextStage(): boolean {
        if (this.currentStageIndex < SOLVING_STAGES.length - 1) {
            this.stageProgress[this.currentStageIndex] = true;
            this.currentStageIndex++;
            return true;
        }
        return false;
    }

    private matchesPattern(state: string, pattern: string): boolean {
        console.log('匹配状态:', state, '目标模式:', pattern);
        if (!state || !pattern || state.length !== pattern.length) return false;

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === '*') continue;
            if (pattern[i] !== state[i]) return false;
        }
        return true;
    }

    // 更新状态并获取当前指南信息
    updateProgress(state: CubeState): GuideInfo {
        this.lastState = state;
        if (this.state === ManagerState.SOLVING && this.isStageComplete()) {
            this.stageProgress[this.currentStageIndex] = true;
            this.moveToNextStage();
        }
        return this.getGuide();
    }

    // 获取解题指南信息
    getGuide(): GuideInfo {
        const currentStage = this.getCurrentStage();
        const nextMove = this.getCurrentMoves()[0] || '';

        return {
            progress: currentStage.cubeProgress || [],
            currentStage: this.currentStageIndex,
            totalStages: SOLVING_STAGES.length,
            nextMove,
            description: currentStage.description
        };
    }
}
