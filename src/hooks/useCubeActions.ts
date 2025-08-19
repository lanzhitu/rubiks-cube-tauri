import { useCallback, useEffect, useState } from "react";
import { parseCubeState, SOLVED_STATE } from "../utils/cubeUtils";
import type { CubeState } from "../types/cube";
import {
    getCubeState as getBackendCubeState,
    rotateCube,
    resetCube,
    getCubeSolution,
} from "../services/cubeApi";

export function useCubeActions({
    cube3DRef,
    solvingManager,
    setIsAnimating,
    setCubeState,
    setBackendState,
    setSyncResult,
    setCurrentProgress,
    setCurrentHints,
    animationSpeed,
    setAnimationSpeed,
}: {
    cube3DRef: React.RefObject<any>;
    solvingManager: React.RefObject<any>;
    setIsAnimating: (v: boolean) => void;
    setCubeState: (v: string) => void;
    setBackendState: (v: string) => void;
    setSyncResult: (v: string) => void;
    setCurrentProgress: (v: number) => void;
    setCurrentHints: (v: string[]) => void;
    animationSpeed: number;
    setAnimationSpeed: (v: number) => void;
}) {
    // 分步解法相关状态
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [currentStageMoves, setCurrentStageMoves] = useState<string[]>([]);

    // 获取完整解法
    const fetchSolution = useCallback(async () => {
        if (!solvingManager.current) return;
        const solution = await getCubeSolution();
        if (Array.isArray(solution) && solution.length > 0) {
            const firstStageMoves = typeof solution[0] === 'string' ? [solution[0]] : solution[0];
            setCurrentStageMoves(firstStageMoves);
        }
        setCurrentStageIndex(0);
    }, [solvingManager]);

    useEffect(() => { fetchSolution(); }, [fetchSolution]);

    // 合并同步与进度更新
    const syncAndUpdate = useCallback(async () => {
        if (!cube3DRef.current || !cube3DRef.current.getCubeState) return;
        const frontendState = cube3DRef.current.getCubeState();
        const backend = await getBackendCubeState();
        setCubeState(frontendState);
        setBackendState(backend);
        setSyncResult(frontendState === backend ? "match" : "mismatch");
        const cubeStateObj: CubeState = {
            raw: frontendState,
            faces: parseCubeState(frontendState),
            isSolved: frontendState === SOLVED_STATE,
        };
        solvingManager.current.updateProgress(cubeStateObj);
        setCurrentProgress(solvingManager.current.getProgress());
        setCurrentHints(solvingManager.current.getCurrentHints());
    }, [cube3DRef, solvingManager, setCubeState, setBackendState, setSyncResult, setCurrentProgress, setCurrentHints]);

    // 分步动画执行
    const executeMove = useCallback(async (move: string) => {
        if (!cube3DRef.current?.triggerRotate) return;

        await new Promise<void>((resolve) => {
            cube3DRef.current.triggerRotate(move, () => resolve());
        });

        await syncAndUpdate();
    }, [cube3DRef, syncAndUpdate]);

    // 执行当前阶段的解法
    const solveCurrentStage = useCallback(async () => {
        if (!cube3DRef.current || cube3DRef.current.isAnimating || currentStageMoves.length === 0) {
            return;
        }

        setIsAnimating(true);

        try {
            // 依次执行当前阶段的每一步
            for (const move of currentStageMoves) {
                await executeMove(move);
            }

            // 检查当前阶段是否完成
            if (solvingManager.current) {
                const isComplete = solvingManager.current.isStepComplete({
                    raw: cube3DRef.current.getCubeState(),
                    faces: [],
                    isSolved: false
                });

                if (isComplete) {
                    // 获取下一阶段的步骤
                    const nextStageIndex = currentStageIndex + 1;
                    setCurrentStageIndex(nextStageIndex);

                    // 更新当前阶段的动作
                    const solution = await getCubeSolution();
                    if (Array.isArray(solution) && nextStageIndex < solution.length) {
                        const nextStageMoves = typeof solution[nextStageIndex] === 'string'
                            ? [solution[nextStageIndex]]
                            : solution[nextStageIndex];
                        setCurrentStageMoves(nextStageMoves);
                    } else {
                        setCurrentStageMoves([]);
                    }
                }
            }
        } catch (error) {
            console.error('执行步骤时出错:', error);
        } finally {
            setIsAnimating(false);
        }
    }, [currentStageMoves, currentStageIndex, cube3DRef, executeMove, setIsAnimating, solvingManager]); const handleMoves = useCallback((moves: string[] | null) => {
        if (!cube3DRef.current?.triggerRotate || !moves || moves.length === 0) return;
        if (cube3DRef.current.isAnimating || typeof setIsAnimating !== "function") return;
        setIsAnimating(true);
        let currentMoveIndex = 0;
        const processNextMove = async () => {
            if (currentMoveIndex >= moves.length) {
                setIsAnimating(false);
                await syncAndUpdate();
                return;
            }
            const move = moves[currentMoveIndex];
            cube3DRef.current.triggerRotate(move, async () => {
                await rotateCube(move);
                await syncAndUpdate();
                currentMoveIndex++;
                processNextMove();
            });
        };
        processNextMove();
    }, [cube3DRef, solvingManager, setIsAnimating, setCurrentProgress, setCurrentHints, syncAndUpdate]);

    const solveCurrentStageWithAnimation = useCallback(() => {
        if (cube3DRef.current?.isAnimating) return;
        solveCurrentStage();
    }, [cube3DRef, solveCurrentStage]);

    const solveFullWithAnimation = useCallback(async () => {
        if (cube3DRef.current?.isAnimating) return;
        try {
            const moves = await getCubeSolution();
            if (Array.isArray(moves) && moves.length > 0) {
                handleMoves(moves);
            } else {
                alert("后端未返回解法或魔方已还原");
            }
        } catch (e) {
            alert("获取解法失败");
        }
    }, [cube3DRef, handleMoves]);

    const randomize = useCallback(async () => {
        if (cube3DRef.current?.isAnimating) return;
        const moves = [];
        const possibleMoves = ["U", "U'", "R", "R'", "F", "F'", "D", "D'", "L", "L'", "B", "B'"];
        for (let i = 0; i < 20; i++) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            moves.push(randomMove);
        }
        handleMoves(moves);
        return;
    }, [cube3DRef, handleMoves]);

    const reset = useCallback(async () => {
        if (cube3DRef.current?.isAnimating) return;
        try {
            await resetCube();
            if (cube3DRef.current && cube3DRef.current.setToDefault) {
                cube3DRef.current.setToDefault();
            } else {
                window.location.reload();
            }
            await syncAndUpdate();
        } catch (e) {
            alert("重置失败");
        }
    }, [cube3DRef, syncAndUpdate]);

    const changeAnimationSpeed = useCallback((speed: number) => {
        if (typeof setAnimationSpeed === "function") setAnimationSpeed(speed);
    }, [setAnimationSpeed]);

    return {
        handleMoves,
        syncAndUpdate,
        solveCurrentStageWithAnimation,
        solveFullWithAnimation,
        randomize,
        reset,
        changeAnimationSpeed,
        currentStageIndex,
    } as {
        handleMoves: (moves: string[] | null, syncBackend?: boolean) => void;
        syncAndUpdate: () => Promise<void>;
        solveCurrentStageWithAnimation: () => void;
        solveFullWithAnimation: () => Promise<void>;
        randomize: () => Promise<void>;
        reset: () => Promise<void>;
        changeAnimationSpeed: (speed: number) => void;
        currentStageIndex: number;
    };
}
