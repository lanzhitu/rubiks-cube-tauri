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
    const [solutionSteps, setSolutionSteps] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    // 获取分步解法
    const fetchSolution = useCallback(async () => {
        const solution = await getCubeSolution();
        if (Array.isArray(solution)) setSolutionSteps(solution);
        setCurrentStep(0);
    }, []);

    useEffect(() => { fetchSolution(); }, [fetchSolution]);

    // 分步动画执行
    const onStepSolve = useCallback(async (step?: number) => {
        const stepIndex = typeof step === "number" ? step : currentStep;
        if (cube3DRef.current?.isAnimating || stepIndex >= solutionSteps.length) {
            setIsAutoPlaying(false);
            return;
        }
        const currentStepData = solutionSteps[stepIndex];
        if (!currentStepData) return;
        setIsAnimating(true);
        for (const move of currentStepData.algorithm) {
            await new Promise<void>((resolve) => {
                if (cube3DRef.current?.triggerRotate) {
                    cube3DRef.current.triggerRotate(move, () => resolve());
                } else {
                    resolve();
                }
            });
        }
        setIsAnimating(false);
        setCurrentStep(stepIndex + 1);
        if (isAutoPlaying) {
            setTimeout(() => onStepSolve(stepIndex + 1), 1000 / animationSpeed);
        }
    }, [solutionSteps, currentStep, isAutoPlaying, animationSpeed, cube3DRef, setIsAnimating]);

    const toggleAutoPlay = useCallback(() => {
        setIsAutoPlaying((prev) => !prev);
        if (!isAutoPlaying) onStepSolve(currentStep);
    }, [isAutoPlaying, onStepSolve, currentStep]);

    const resetSteps = useCallback(() => {
        setCurrentStep(0);
        setIsAutoPlaying(false);
        fetchSolution();
    }, [fetchSolution]);

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

    const solveAndAnimate = useCallback(() => {
        if (cube3DRef.current?.isAnimating) return;
        handleMoves(["U", "U'", "U", "U'"]);
    }, [cube3DRef, handleMoves]);

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
        solutionSteps,
        currentStep,
        setCurrentStep,
        isAutoPlaying,
        toggleAutoPlay,
        onStepSolve,
        resetSteps,
    } as {
        handleMoves: (moves: string[] | null, syncBackend?: boolean) => void;
        syncAndUpdate: () => Promise<void>;
        solveAndAnimate: () => void;
        solveFullWithAnimation: () => Promise<void>;
        randomize: () => Promise<void>;
        reset: () => Promise<void>;
        changeAnimationSpeed: (speed: number) => void;
        solutionSteps: any[];
        currentStep: number;
        setCurrentStep: (step: number) => void;
        isAutoPlaying: boolean;
        toggleAutoPlay: () => void;
        onStepSolve: (step?: number) => void;
        resetSteps: () => void;
    };
}
