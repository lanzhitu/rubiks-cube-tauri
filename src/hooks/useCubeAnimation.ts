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

    // 统一旋转：move为"U"/"R'"/"X"/"Y"/"Z"，整体旋转用"X"/"Y"/"Z"
    const rotateCubies = (move: string) => {
        if (move === 'X' || move === 'Y' || move === 'Z') {
            const axis: [number, number, number] = move === 'X' ? [1, 0, 0] : move === 'Y' ? [0, 1, 0] : [0, 0, 1];
            const ang = - Math.PI / 2;
            setCubies((prev) => prev.map((cubie) => ({
                ...cubie,
                position: rotatePosition(cubie.position, axis, ang),
                orientation: rotateOrientation(
                    cubie.orientation || [0, 0, 0],
                    axis,
                    ang
                ),
            })));
        } else {
            const face = move[0].toUpperCase() as FaceColor;
            const isPrime = move.endsWith("'");
            const filterFn = layerFilter[face as keyof typeof layerFilter];
            const rot = FACE_ROTATION_MAP[face];
            if (!filterFn || !rot) return;
            const axis: [number, number, number] = rot.axis as [number, number, number];
            const ang = isPrime ? rot.ccw : rot.cw;
            setCubies((prev) => prev.map((cubie) => {
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
            }));
        }
    };

    // 统一动画触发入口
    const triggerRotate = (move: string, onEnd?: () => void) => {
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
        let axis: [number, number, number];
        let angle: number;
        if (move === 'X' || move === 'Y' || move === 'Z') {
            axis = move === 'X' ? [1, 0, 0] : move === 'Y' ? [0, 1, 0] : [0, 0, 1];
            angle = - Math.PI / 2;
        } else {
            const face = move[0].toUpperCase() as FaceColor;
            const isPrime = move.endsWith("'");
            const rot = FACE_ROTATION_MAP[face];
            axis = rot ? rot.axis : [0, 1, 0];
            angle = rot ? (isPrime ? rot.ccw : rot.cw) : Math.PI / 2;
        }
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
        ? (currentMove === 'X' || currentMove === 'Y' || currentMove === 'Z')
            ? cubieList // 整体旋转时所有 cubie 都动画
            : getAnimatedCubies(currentMove, cubieList)
        : [];
    const staticCubies: CubieType[] = currentMove
        ? (currentMove === 'X' || currentMove === 'Y' || currentMove === 'Z')
            ? [] // 整体旋转时无静态 cubie
            : cubieList.filter((cubie) => !animatedCubies.includes(cubie))
        : cubieList;

    return {
        cubies,
        animatedCubies,
        staticCubies,
        springs,
        triggerRotate,
        isAnimating,
        setCubies,
    };
}
