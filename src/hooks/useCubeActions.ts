import { useCallback } from "react";
import { parseCubeState, SOLVED_STATE } from "../utils/cubeUtils";
import type { CubeState } from "../types/cube";
import {
    getCubeState as getBackendCubeState,
    rotateCube,
    resetCube,
    solveCube,
    scrambleCube,
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
            const moves = await solveCube();
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
        try {
            const scrambledState = await scrambleCube();
            if (cube3DRef.current && cube3DRef.current.setState) {
                cube3DRef.current.setState(scrambledState);
            } else {
                window.location.reload();
            }
            await syncAndUpdate();
        } catch (e) {
            alert("打乱失败");
        }
    }, [cube3DRef, syncAndUpdate]);

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
    } as {
        handleMoves: (moves: string[] | null, syncBackend?: boolean) => void;
        syncAndUpdate: () => Promise<void>;
        solveAndAnimate: () => void;
        solveFullWithAnimation: () => Promise<void>;
        randomize: () => Promise<void>;
        reset: () => Promise<void>;
        changeAnimationSpeed: (speed: number) => void;
    };
}
