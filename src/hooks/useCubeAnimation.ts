import { useState, useRef } from "react";
import { useSpring } from "@react-spring/three";
import {
    getDefaultCubies,
    getAnimatedCubies,
    rotatePosition,
    rotateOrientation,
    layerFilter,
} from "../utils/cubeUtils";
import type { CubieType } from "../utils/cubeTypes";
import { FACE_ROTATION_MAP, type FaceColor } from "../utils/cubeConstants";

export function useCubeAnimation(animationSpeed: number = 1) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentMove, setCurrentMove] = useState<string | null>(null);
    const [cubies, setCubies] = useState<CubieType[]>(
        getDefaultCubies().map((cubie) => ({ ...cubie, orientation: [0, 0, 0] }))
    );
    const onAnimationEndCallbackRef = useRef<(() => void) | null>(null);

    const [springs, api] = useSpring(() => ({
        rotation: [0, 0, 0] as [number, number, number],
        config: {
            tension: 120,
            friction: 14,
            precision: 0.0001,
        },
        onRest: () => {
            setIsAnimating(false);
            setCurrentMove(null);
            api.set({ rotation: [0, 0, 0] });
            if (onAnimationEndCallbackRef.current) {
                const callback = onAnimationEndCallbackRef.current;
                onAnimationEndCallbackRef.current = null;
                callback();
            }
        },
    }));

    // 支持单层和整体旋转：
    // - move: 普通字符串如 "U"/"R'"，则只旋转对应层
    // - axis/angle: 若传入则整体旋转所有 cubie
    const rotateCubies = (moveOrAxis: string | [number, number, number], angle?: number) => {
        if (typeof moveOrAxis === "string") {
            const move = moveOrAxis;
            const face = move[0].toUpperCase() as FaceColor;
            const isPrime = move.endsWith("'");
            const filterFn = layerFilter[face as keyof typeof layerFilter];
            const rot = FACE_ROTATION_MAP[face];
            if (!filterFn || !rot) return;
            const axis = rot.axis;
            const ang = isPrime ? rot.ccw : rot.cw;
            setCubies((prev) => {
                return prev.map((cubie) => {
                    if (!filterFn(cubie)) return cubie;
                    return {
                        ...cubie,
                        position: rotatePosition(cubie.position, axis, ang),
                        orientation: rotateOrientation(
                            cubie.orientation || [0, 0, 0],
                            axis,
                            ang
                        ),
                    };
                });
            });
        } else {
            // 整体旋转：所有 cubie 都参与，orientation 也变
            const axis = moveOrAxis;
            const ang = angle ?? Math.PI / 2;
            setCubies((prev) => {
                return prev.map((cubie) => ({
                    ...cubie,
                    position: rotatePosition(cubie.position, axis, ang),
                    orientation: rotateOrientation(
                        cubie.orientation || [0, 0, 0],
                        axis,
                        ang
                    ),
                }));
            });
        }
    };

    const triggerLayerRotate = (move: string, onEnd?: () => void) => {
        if (isAnimating) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }
        setIsAnimating(true);
        setCurrentMove(move);
        onAnimationEndCallbackRef.current = () => {
            rotateCubies(move);
            if (typeof onEnd === 'function') onEnd();
        };
        const face = move[0].toUpperCase() as FaceColor;
        const isPrime = move.endsWith("'");
        const rot = FACE_ROTATION_MAP[face];
        const axis = rot ? rot.axis : [0, 1, 0];
        const angle = rot ? (isPrime ? rot.ccw : rot.cw) : Math.PI / 2;
        const rotation: [number, number, number] = [0, 0, 0];
        if (axis[0]) rotation[0] = angle * axis[0];
        if (axis[1]) rotation[1] = angle * axis[1];
        if (axis[2]) rotation[2] = angle * axis[2];
        setTimeout(() => {
            api.start({
                to: { rotation },
                from: { rotation: [0, 0, 0] },
                config: { duration: 300 / animationSpeed },
            });
        }, 10);
    };

    const cubieList = cubies;
    const animatedCubies: CubieType[] = currentMove
        ? currentMove === "__rotate__"
            ? cubieList // 整体旋转时所有 cubie 都动画
            : getAnimatedCubies(currentMove, cubieList)
        : [];
    const staticCubies: CubieType[] = currentMove
        ? currentMove === "__rotate__"
            ? [] // 整体旋转时无静态 cubie
            : cubieList.filter((cubie) => !animatedCubies.includes(cubie))
        : cubieList;

    // 魔方整体旋转动画及 cubies 变换（参数化）
    const triggerCubeRotate = (
        axis: [number, number, number],
        onEnd?: () => void
    ) => {
        if (isAnimating) {
            if (onEnd) setTimeout(onEnd, 100);
            return;
        }
        setIsAnimating(true);
        setCurrentMove("__rotate__"); // 标记整体旋转动画
        const angle = Math.PI / 2; // 默认顺时针90度
        onAnimationEndCallbackRef.current = () => {
            rotateCubies(axis, angle);
            if (typeof onEnd === 'function') onEnd();
        };
        // 计算动画目标 rotation
        const rotation: [number, number, number] = [0, 0, 0];
        if (axis[0]) rotation[0] = angle * axis[0];
        if (axis[1]) rotation[1] = angle * axis[1];
        if (axis[2]) rotation[2] = angle * axis[2];
        setTimeout(() => {
            api.start({
                to: { rotation },
                from: { rotation: [0, 0, 0] },
                config: { duration: 300 / animationSpeed },
            });
        }, 10);
    };

    return {
        cubies,
        animatedCubies,
        staticCubies,
        springs,
        triggerLayerRotate,
        triggerCubeRotate,
        isAnimating,
        setCubies,
    };
}
