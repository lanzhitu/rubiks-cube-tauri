import { SOLVING_STAGES } from '../constants/solvingSteps';
import type { SolvingStage, SolvingStep, CubeState } from '../types/cube';

export class SolvingManager {
    private currentStageIndex: number = 0;
    private currentStepIndex: number = 0;
    private stageProgress: boolean[] = [];
    private stepProgress: boolean[][] = [];

    constructor() {
        // 初始化进度追踪数组
        this.stageProgress = new Array(SOLVING_STAGES.length).fill(false);
        this.stepProgress = SOLVING_STAGES.map(stage =>
            new Array(stage.steps.length).fill(false)
        );
    }

    // 获取当前阶段
    getCurrentStage(): SolvingStage {
        return SOLVING_STAGES[this.currentStageIndex];
    }

    // 获取当前步骤
    getCurrentStep(): SolvingStep {
        const currentStage = this.getCurrentStage();
        return currentStage.steps[this.currentStepIndex];
    }

    // 检查步骤是否完成
    isStepComplete(state: CubeState): boolean {
        const currentStep = this.getCurrentStep();
        return this.matchesPattern(state.raw, currentStep.targetPattern);
    }

    // 检查阶段是否完成
    isStageComplete(): boolean {
        return this.stepProgress[this.currentStageIndex]
            .every(stepComplete => stepComplete);
    }

    // 移动到下一步
    moveToNextStep(): boolean {
        const currentStage = this.getCurrentStage();
        if (this.currentStepIndex < currentStage.steps.length - 1) {
            this.currentStepIndex++;
            return true;
        } else if (this.currentStageIndex < SOLVING_STAGES.length - 1) {
            this.currentStageIndex++;
            this.currentStepIndex = 0;
            return true;
        }
        return false;
    }

    // 获取当前进度
    getProgress(): number {
        const totalSteps = SOLVING_STAGES.reduce(
            (sum, stage) => sum + stage.steps.length,
            0
        );
        const completedSteps = this.stepProgress.reduce(
            (sum, stageProgress) =>
                sum + stageProgress.filter(step => step).length,
            0
        );
        return (completedSteps / totalSteps) * 100;
    }

    // 获取当前提示
    getCurrentHints(): string[] {
        return this.getCurrentStep().hints;
    }

    // 获取下一步推荐动作
    getNextMoves(): string[] | undefined {
        return this.getCurrentStep().algorithm;
    }

    // 重置进度
    reset(): void {
        this.currentStageIndex = 0;
        this.currentStepIndex = 0;
        this.stageProgress = new Array(SOLVING_STAGES.length).fill(false);
        this.stepProgress = SOLVING_STAGES.map(stage =>
            new Array(stage.steps.length).fill(false)
        );
    }

    private matchesPattern(state: string, pattern: string): boolean {
        if (state.length !== pattern.length) return false;

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === '*') continue;
            if (pattern[i] !== state[i]) return false;
        }
        return true;
    }

    // 更新进度
    updateProgress(state: CubeState): void {
        if (this.isStepComplete(state)) {
            this.stepProgress[this.currentStageIndex][this.currentStepIndex] = true;
            if (this.isStageComplete()) {
                this.stageProgress[this.currentStageIndex] = true;
            }
        }
    }
}
