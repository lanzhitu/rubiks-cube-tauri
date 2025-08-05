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

    const rotateCubies = (move: string) => {
        const face = move[0].toUpperCase() as FaceColor;
        const isPrime = move.endsWith("'");
        const filterFn = layerFilter[face as keyof typeof layerFilter];
        const rot = FACE_ROTATION_MAP[face];
        if (!filterFn || !rot) return;
        const axis = rot.axis;
        const angle = isPrime ? rot.ccw : rot.cw;
        setCubies((prev) => {
            return prev.map((cubie) => {
                if (!filterFn(cubie)) return cubie;
                return {
                    ...cubie,
                    position: rotatePosition(cubie.position, axis, angle),
                    orientation: rotateOrientation(
                        cubie.orientation || [0, 0, 0],
                        axis,
                        angle
                    ),
                };
            });
        });
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
            if (onEnd) onEnd();
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
        ? getAnimatedCubies(currentMove, cubieList)
        : [];
    const staticCubies = currentMove
        ? cubieList.filter((cubie) => !animatedCubies.includes(cubie))
        : cubieList;

    return {
        cubies,
        animatedCubies,
        staticCubies,
        springs,
        triggerLayerRotate,
        isAnimating,
        setCubies,
    };
}
