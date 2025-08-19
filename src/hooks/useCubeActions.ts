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
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [fullSolution, setFullSolution] = useState<string[]>([]);
    const [remainingMoves, setRemainingMoves] = useState<string[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    // 获取完整解法
    const fetchSolution = useCallback(async () => {
        if (!solvingManager.current) return;
        const solution = await getCubeSolution();
        if (Array.isArray(solution)) {
            setFullSolution(solution);
            setRemainingMoves(solution);
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

    const onStepSolve = useCallback(async () => {
        if (cube3DRef.current?.isAnimating || remainingMoves.length === 0 || isPaused) {
            setIsAutoPlaying(false);
            return;
        }

        setIsAnimating(true);

        try {
            const nextMove = remainingMoves[0];
            await executeMove(nextMove);

            // 从剩余步骤中移除已执行的动作
            setRemainingMoves(prev => prev.slice(1));

            // 检查当前阶段是否完成
            if (solvingManager.current) {
                const isComplete = solvingManager.current.isStepComplete({
                    raw: cube3DRef.current.getCubeState(),
                    faces: [],
                    isSolved: false
                });

                if (isComplete) {
                    // 暂停动画，等待用户确认
                    setIsAutoPlaying(false);
                    setIsPaused(true);

                    // 更新到下一个阶段
                    setCurrentStageIndex(prev => prev + 1);
                    return;
                }
            }
        } catch (error) {
            console.error('执行步骤时出错:', error);
            setIsAutoPlaying(false);
        } finally {
            setIsAnimating(false);

            // 如果还有剩余步骤且处于自动播放状态，继续执行
            if (isAutoPlaying && remainingMoves.length > 0 && !isPaused) {
                setTimeout(() => onStepSolve(), 1000 / animationSpeed);
            }
        }
    }, [remainingMoves, isAutoPlaying, animationSpeed, cube3DRef, setIsAnimating, executeMove, isPaused, solvingManager]);

    // 继续下一个阶段
    const continueNextStage = useCallback(() => {
        if (currentStageIndex >= fullSolution.length) return;

        // Reset state for next stage
        setIsPaused(false);
        setIsAutoPlaying(true);

        // Get moves for the next stage
        const nextStageMoves = fullSolution[currentStageIndex];
        setRemainingMoves(typeof nextStageMoves === 'string' ? [nextStageMoves] : nextStageMoves);

        // Continue execution
        onStepSolve();
    }, [currentStageIndex, fullSolution, onStepSolve]);

    const toggleAutoPlay = useCallback(() => {
        if (isPaused) {
            // If paused, resume from current stage
            continueNextStage();
        } else {
            // If not paused, toggle auto play state
            setIsAutoPlaying((prev) => {
                const newState = !prev;
                if (newState) {
                    onStepSolve(); // Start playing if turning on
                }
                return newState;
            });
        }
    }, [isPaused, continueNextStage, onStepSolve]);

    const handleMoves = useCallback((moves: string[] | null) => {
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

    const resetSteps = useCallback(() => {
        setCurrentStageIndex(0);
        setIsAutoPlaying(false);
        setIsPaused(false);
        fetchSolution();
    }, [fetchSolution]);

    const solveAndAnimate = useCallback(() => {
        if (cube3DRef.current?.isAnimating) return;
        if (remainingMoves.length > 0) {
            setIsAutoPlaying(true);
            onStepSolve();
        }
    }, [cube3DRef, remainingMoves, onStepSolve]);

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
        solveAndAnimate,
        solveFullWithAnimation,
        randomize,
        reset,
        changeAnimationSpeed,
        currentStageIndex,
        remainingMoves,
        isPaused,
        isAutoPlaying,
        toggleAutoPlay,
        continueNextStage,
        resetSteps,
    } as {
        handleMoves: (moves: string[] | null, syncBackend?: boolean) => void;
        syncAndUpdate: () => Promise<void>;
        solveAndAnimate: () => void;
        solveFullWithAnimation: () => Promise<void>;
        randomize: () => Promise<void>;
        reset: () => Promise<void>;
        changeAnimationSpeed: (speed: number) => void;
        currentStageIndex: number;
        remainingMoves: string[];
        isPaused: boolean;
        isAutoPlaying: boolean;
        toggleAutoPlay: () => void;
        continueNextStage: () => void;
        resetSteps: () => void;
    };
}
