import { useCallback, useEffect, useState } from "react";
import { SOLVED_STATE } from "../utils/cubeUtils";
import type { CubeState } from "../types/cube";
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
    animationSpeed,
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
    // 分步解法相关状态
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [fullSolution, setFullSolution] = useState<string[][]>([]);
    const [moveIndex, setMoveIndex] = useState(0); // 当前执行到的步骤索引

    // 获取完整解法
    const fetchSolution = useCallback(async () => {
        if (!solvingManager.current) return;
        const solution = await getCubeSolution();
        if (Array.isArray(solution) && solution.length > 0) {
            // 预处理并展开所有步骤为一个一维数组
            const processedSolution = solution.map(stage =>
                typeof stage === 'string' ? [stage] : stage
            );
            setFullSolution(processedSolution);
            setCurrentStageIndex(0); // 重置阶段索引
            setMoveIndex(0); // 重置步骤索引
        }
    }, [solvingManager]);

    // 只在组件挂载时获取一次解法
    useEffect(() => {
        fetchSolution();
    }, []);

    // 合并同步与进度更新
    const syncAndUpdate = useCallback(async () => {
        if (!cube3DRef.current || !cube3DRef.current.getCubeState) return;
        const frontendState = cube3DRef.current.getCubeState();
        const cubeStateObj: CubeState = {
            raw: frontendState,
            isSolved: frontendState === SOLVED_STATE,
        };
        solvingManager.current.updateProgress(cubeStateObj);
        setCurrentProgress(solvingManager.current.getProgress());
        setCurrentHints(solvingManager.current.getCurrentHints());
    }, [cube3DRef, solvingManager, setCurrentProgress, setCurrentHints]);

    // 分步动画执行
    const executeMove = useCallback(async (move: string) => {
        if (!cube3DRef.current?.triggerRotate) return;

        // 执行前端动画
        await new Promise<void>((resolve) => {
            cube3DRef.current.triggerRotate(move, resolve);
        });

        // 同步后端状态
        await rotateCube(move);
        await syncAndUpdate();
    }, [cube3DRef, rotateCube, syncAndUpdate]);

    // 执行当前阶段的解法
    const solveCurrentStage = useCallback(async () => {
        if (!cube3DRef.current || cube3DRef.current.isAnimating) {
            return;
        }

        setIsAnimating(true);

        try {
            const currentState = cube3DRef.current.getCubeState();
            const isSolved = currentState === SOLVED_STATE;

            if (isSolved) {
                console.log('魔方已还原');
                setIsAnimating(false);
                return;
            }

            let allMoves = fullSolution.flat();

            // 确保解法已加载
            if (fullSolution.length === 0) {
                console.log("解法未加载，正在加载...");
                const processedSolution = await loadAndProcessSolution(getCubeSolution, setFullSolution);
                allMoves = processedSolution.flat();
            }

            let currentMoveIndex = moveIndex;

            console.log('开始执行，当前阶段:', currentStageIndex, '步骤索引:', currentMoveIndex);

            while (currentMoveIndex < allMoves.length) {
                await executeMove(allMoves[currentMoveIndex]);
                currentMoveIndex++;

                if (solvingManager.current) {
                    const guideInfo = solvingManager.current.updateProgress({
                        raw: cube3DRef.current.getCubeState(),
                        isSolved: false
                    });

                    console.log('阶段完成状态:', guideInfo.currentStage > currentStageIndex);
                    if (guideInfo.currentStage > currentStageIndex) {
                        console.log('当前阶段完成，保存进度并进入下一阶段');
                        setMoveIndex(currentMoveIndex);

                        const nextStageIndex = currentStageIndex + 1;
                        if (nextStageIndex < guideInfo.totalStages) {
                            setCurrentStageIndex(nextStageIndex);
                            console.log(`阶段 ${currentStageIndex} 完成，等待用户开始阶段 ${nextStageIndex}`);
                        } else {
                            console.log('所有阶段已完成');
                        }
                        break; // 退出循环，等待用户触发下一阶段
                    }
                }

                if (currentMoveIndex >= allMoves.length) {
                    setMoveIndex(0);
                }
            }
        } catch (error) {
            console.error('执行步骤时出错:', error);
        } finally {
            setIsAnimating(false);
        }
    }, [moveIndex, currentStageIndex, fullSolution, cube3DRef, executeMove, setIsAnimating, solvingManager, getCubeSolution]);

    const handleMoves = useCallback(async (moves: string[] | null) => {
        if (!cube3DRef.current?.triggerRotate || !moves || moves.length === 0) return;
        if (cube3DRef.current.isAnimating || typeof setIsAnimating !== "function") return;

        setIsAnimating(true);
        try {
            // 依次执行每个动作
            for (const move of moves) {
                await executeMove(move);
            }
        } catch (error) {
            console.error('执行动作序列时出错:', error);
        } finally {
            setIsAnimating(false);
        }
    }, [cube3DRef, executeMove, setIsAnimating, animationSpeed]);

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

        solvingManager.current?.reset();

        // 设置为打乱状态
        solvingManager.current?.setState(ManagerState.SCRAMBLING);
        setMoveIndex(0);
        setCurrentProgress(0);
        setCurrentStageIndex(0);
        setFullSolution([]);


        const moves = [];
        const possibleMoves = ["U", "U'", "R", "R'", "F", "F'", "D", "D'", "L", "L'", "B", "B'"];
        for (let i = 0; i < 20; i++) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            moves.push(randomMove);
        }

        await handleMoves(moves);

        // 恢复为解题状态
        solvingManager.current?.setState(ManagerState.SOLVING);
    }, [cube3DRef, handleMoves, solvingManager]);

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

    // 加载并处理解法的辅助函数
    const loadAndProcessSolution = async (
        getCubeSolution: () => Promise<any>,
        setFullSolution: (solution: string[][]) => void
    ): Promise<string[][]> => {
        const solution = await getCubeSolution();
        if (Array.isArray(solution) && solution.length > 0) {
            const processedSolution = solution.map(stage =>
                typeof stage === 'string' ? [stage] : stage
            );
            setFullSolution(processedSolution);
            return processedSolution;
        }
        throw new Error("Failed to load solution");
    };

    // 执行单步并检查阶段完成的辅助函数
    const executeMoveAndCheckStage = async (
        move: string,
        executeMove: (move: string) => Promise<void>,
        solvingManager: React.RefObject<any>,
        cube3DRef: React.RefObject<any>,
        currentStageIndex: number,
        setCurrentStageIndex: (index: number) => void
    ) => {
        await executeMove(move);
        if (solvingManager.current) {
            const guideInfo = solvingManager.current.updateProgress({
                raw: cube3DRef.current.getCubeState(),
                isSolved: false
            });
            if (guideInfo.currentStage > currentStageIndex) {
                setCurrentStageIndex(currentStageIndex + 1);
            }
        }
    };

    const solveCurrentStageStep = useCallback(async () => {
        if (!cube3DRef.current || cube3DRef.current.isAnimating) {
            console.log("无法执行：动画正在进行或未初始化");
            return;
        }

        setIsAnimating(true);

        try {
            const currentState = cube3DRef.current.getCubeState();
            const isSolved = currentState === SOLVED_STATE;

            if (isSolved) {
                console.log('魔方已还原');
                setIsAnimating(false);
                return;
            }
            let allMoves = fullSolution.flat();

            // 确保解法已加载
            if (fullSolution.length === 0) {
                console.log("解法未加载，正在加载...");
                const processedSolution = await loadAndProcessSolution(getCubeSolution, setFullSolution);
                setCurrentStageIndex(0);
                setMoveIndex(0);
                allMoves = processedSolution.flat();
            }

            if (allMoves.length === 0) {
                console.error("解法步骤为空，无法执行");
                return;
            }

            if (moveIndex >= allMoves.length) {
                console.log("当前阶段已完成，无法执行更多步骤");
                return;
            }

            console.log(`正在执行步骤 ${moveIndex}: ${allMoves[moveIndex]}`);
            await executeMoveAndCheckStage(
                allMoves[moveIndex],
                executeMove,
                solvingManager,
                cube3DRef,
                currentStageIndex,
                setMoveIndex,
            );
            setMoveIndex(moveIndex + 1);
        } catch (error) {
            console.error("单步执行时出错:", error);
        } finally {
            setIsAnimating(false);
        }
    }, [cube3DRef, executeMove, fullSolution, moveIndex, currentStageIndex, solvingManager, setIsAnimating, getCubeSolution]);

    return {
        handleMoves,
        syncAndUpdate,
        solveCurrentStageWithAnimation,
        solveFullWithAnimation,
        randomize,
        reset,
        changeAnimationSpeed,
        currentStageIndex,
        solveCurrentStageStep,
    } as {
        handleMoves: (moves: string[] | null, syncBackend?: boolean) => void;
        syncAndUpdate: () => Promise<void>;
        solveCurrentStageWithAnimation: () => void;
        solveFullWithAnimation: () => Promise<void>;
        randomize: () => Promise<void>;
        reset: () => Promise<void>;
        changeAnimationSpeed: (speed: number) => void;
        currentStageIndex: number;
        solveCurrentStageStep: () => Promise<void>;
    };
}
