import { SOLVING_STAGES } from '../constants/solvingSteps';
import type { SolvingStage, SolvingStep, CubeState } from '../types/cube';
import type { GuideInfo } from '../types/solving';


export class SolvingManager {
    private currentStageIndex: number = 0;
    private currentStepIndex: number = 0;
    private stageProgress: boolean[] = [];
    private stepProgress: boolean[][] = [];
    private solution: string[] = [];

    constructor(solution: string[] = []) {
        this.solution = solution;
        // 初始化进度追踪数组
        this.stageProgress = new Array(SOLVING_STAGES.length).fill(false);
        this.stepProgress = SOLVING_STAGES.map(stage =>
            new Array(stage.steps.length).fill(false)
        );
        // 确保初始状态是第一个步骤
        this.currentStageIndex = 0;
        this.currentStepIndex = 0;
    }

    // 获取当前阶段
    getCurrentStage(): SolvingStage {
        // 确保索引在有效范围内
        if (this.currentStageIndex >= SOLVING_STAGES.length) {
            this.currentStageIndex = SOLVING_STAGES.length - 1;
        }
        return SOLVING_STAGES[this.currentStageIndex];
    }

    // 获取当前步骤
    getCurrentStep(): SolvingStep {
        const currentStage = this.getCurrentStage();
        // 确保索引在有效范围内
        if (this.currentStepIndex >= currentStage.steps.length) {
            this.currentStepIndex = currentStage.steps.length - 1;
        }
        return currentStage.steps[this.currentStepIndex];
    }

    // 检查步骤是否完成
    isStepComplete(state: CubeState | undefined): boolean {
        if (!state?.raw) return false;
        const currentStep = this.getCurrentStep();
        if (!currentStep?.targetPattern) return false;
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
        if (!state || !pattern || state.length !== pattern.length) return false;

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === '*') continue;
            if (pattern[i] !== state[i]) return false;
        }
        return true;
    }

    // 更新进度
    updateProgress(state: CubeState | undefined): void {
        if (!state) return;
        if (this.isStepComplete(state)) {
            this.stepProgress[this.currentStageIndex][this.currentStepIndex] = true;
            if (this.isStageComplete()) {
                this.stageProgress[this.currentStageIndex] = true;
            }
            this.moveToNextStep();
        }
    }

    // 获取当前步骤索引
    private getCurrentStepIndex(): number {
        let totalSteps = 0;
        for (let i = 0; i < this.currentStageIndex; i++) {
            totalSteps += SOLVING_STAGES[i].steps.length;
        }
        return totalSteps + this.currentStepIndex;
    }

    // 获取解题指南信息
    getGuide(): GuideInfo {
        const stage = this.getCurrentStage();
        const step = this.getCurrentStep();
        const totalSteps = SOLVING_STAGES.reduce(
            (sum, stage) => sum + stage.steps.length, 0
        );
        const currentStepIndex = this.getCurrentStepIndex();

        // 如果有解法，使用解法的下一步，否则使用当前步骤的默认算法
        const nextMove = this.solution.length > 0
            ? (this.solution[currentStepIndex] || '')
            : (step.algorithm ? step.algorithm[0] || '' : '');

        return {
            progress: stage.cubeProgress,
            currentStep: currentStepIndex + 1,
            totalSteps: totalSteps,
            nextMove: nextMove,
            description: step.description
        };
    }

    // 更新状态并返回新的指南信息
    updateState(state: CubeState | undefined): GuideInfo {
        this.updateProgress(state);
        return this.getGuide();
    }

    // 前一步
    prevStep(): GuideInfo {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
        } else if (this.currentStageIndex > 0) {
            this.currentStageIndex--;
            this.currentStepIndex = SOLVING_STAGES[this.currentStageIndex].steps.length - 1;
        }
        return this.getGuide();
    }

    // 后一步
    nextStep(): GuideInfo {
        const currentStage = this.getCurrentStage();
        if (this.currentStepIndex < currentStage.steps.length - 1) {
            this.currentStepIndex++;
        } else if (this.currentStageIndex < SOLVING_STAGES.length - 1) {
            this.currentStageIndex++;
            this.currentStepIndex = 0;
        }
        return this.getGuide();
    }
}
