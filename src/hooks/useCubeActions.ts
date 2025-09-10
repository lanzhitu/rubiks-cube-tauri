import { useCallback, useState } from "react";
import { SOLVED_STATE } from "../utils/cubeUtils";
import {
    rotateCube,
    resetCube,
    getCubeSolution,
} from "../services/cubeApi";
import { ManagerState } from "../utils/solvingManager";

export function useCubeActions({
    cube3DRef,
    solvingManager,
    setIsAnimating,
    setCurrentProgress,
    setCurrentHints,
    setAnimationSpeed,
}: {
    cube3DRef: React.RefObject<any>;
    solvingManager: React.RefObject<any>;
    setIsAnimating: (v: boolean) => void;
    setCurrentProgress: (v: number) => void;
    setCurrentHints: (v: string[]) => void;
    animationSpeed: number;
    setAnimationSpeed: (v: number) => void;
}) {
    // --- 状态 ---
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [fullSolution, setFullSolution] = useState<string[][]>([]);
    const [moveIndex, setMoveIndex] = useState(0);

    // --- 通用解法加载 ---
    const ensureSolution = useCallback(async () => {
        if (fullSolution.length === 0) {
            const solution = await getCubeSolution();
            const processed = Array.isArray(solution) ? solution.map(s => typeof s === 'string' ? [s] : s) : [];
            setFullSolution(processed);
            setCurrentStageIndex(0);
            setMoveIndex(0);
            return processed.flat();
        }
        return fullSolution.flat();
    }, [fullSolution, getCubeSolution]);

    // --- 通用进度同步 ---
    const syncAndUpdate = useCallback(() => {
        if (!cube3DRef.current?.getCubeState) return;
        const state = cube3DRef.current.getCubeState();
        solvingManager.current.updateProgress({ raw: state, isSolved: state === SOLVED_STATE });
        setCurrentProgress(solvingManager.current.getProgress());
        setCurrentHints(solvingManager.current.getCurrentHints());
    }, [cube3DRef, solvingManager, setCurrentProgress, setCurrentHints]);

    // --- 通用动作执行 ---
    const executeMove = useCallback(async (move: string) => {
        if (!cube3DRef.current?.triggerRotate) return;
        await new Promise<void>(resolve => cube3DRef.current.triggerRotate(move, resolve));
        await rotateCube(move);
        syncAndUpdate();
    }, [cube3DRef, rotateCube, syncAndUpdate]);

    // --- 通用分步执行 ---
    const runSolution = useCallback(async (type: "full" | "stage" | "step") => {
        setIsAnimating(true);
        try {
            const allMoves = await ensureSolution();
            let stageIndex = currentStageIndex;
            let moveIdx = moveIndex;
            while (moveIdx < allMoves.length) {
                await executeMove(allMoves[moveIdx]);
                moveIdx++;
                const guideInfo = solvingManager.current.updateProgress({
                    raw: cube3DRef.current.getCubeState(), isSolved: false
                });
                if (guideInfo.currentStage > stageIndex) {
                    stageIndex = guideInfo.currentStage;
                    setCurrentStageIndex(stageIndex);
                    setMoveIndex(moveIdx);
                    if (type === "stage") break;
                }
                setMoveIndex(moveIdx);
                if (type === "step") break;
            }
        } finally {
            setIsAnimating(false);
        }
    }, [ensureSolution, executeMove, solvingManager, cube3DRef, currentStageIndex, moveIndex, setIsAnimating, setCurrentStageIndex, setMoveIndex]);

    // --- 统一暴露接口 ---
    return {
        solveFullWithAnimation: () => runSolution("full"),
        solveCurrentStageWithAnimation: () => runSolution("stage"),
        solveCurrentStageStep: () => runSolution("step"),
        handleMoves: async (moves: string[]) => { setIsAnimating(true); for (const m of moves) await executeMove(m); setIsAnimating(false); },
        randomize: async () => {
            if (cube3DRef.current?.isAnimating) return;
            solvingManager.current?.reset();
            solvingManager.current?.setState(ManagerState.SCRAMBLING);
            setMoveIndex(0);
            setCurrentProgress(0);
            setCurrentStageIndex(0);
            setFullSolution([]);
            const moves = [];
            const possibleMoves = ["U", "U'", "R", "R'", "F", "F'", "D", "D'", "L", "L'", "B", "B'"];
            for (let i = 0; i < 20; i++) moves.push(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
            for (const move of moves) {
                await executeMove(move);
            }
            solvingManager.current?.setState(ManagerState.SOLVING);
        },
        reset: async () => {
            if (cube3DRef.current?.isAnimating) return;
            try {
                await resetCube();
                if (cube3DRef.current && cube3DRef.current.setToDefault) cube3DRef.current.setToDefault();
                else window.location.reload();
                syncAndUpdate();
            } catch (e) { alert("重置失败"); }
        },
        changeAnimationSpeed: setAnimationSpeed,
        currentStageIndex
    };
}
