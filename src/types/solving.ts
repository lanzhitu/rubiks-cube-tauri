export type CubeProgress =
    | 'IN_PROGRESS'
    | 'BOTTOM_CROSS'
    | 'BOTTOM_COMPLETE'
    | 'MIDDLE_LAYER'
    | 'SOLVED';

export interface GuideInfo {
    progress: CubeProgress;
    currentStep: number;
    totalSteps: number;
    nextMove: string;
    description: string;
}
