import { useState, useRef, useMemo, useEffect } from "react";
import { useSpring } from "@react-spring/three";
import { getDefaultCubies, getAnimatedCubies } from "../utils/cubeUtils";
import { rotateCubies, getRotationParams } from "../utils/cubeAnimationUtils";
import type { CubieType } from "../utils/cubeTypes";

export function useCubeAnimation(animationSpeed: number = 1) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentMove, setCurrentMove] = useState<string | null>(null);
    const [cubies, setCubies] = useState<CubieType[]>(getDefaultCubies().map(c => ({ ...c, orientation: [0, 0, 0] })));
    const onEndRef = useRef<(() => void) | null>(null);

    const [springs, api] = useSpring(() => ({
        rotation: [0, 0, 0],
        config: { duration: 300 / animationSpeed },
        onRest: () => {
            setIsAnimating(false);
            if (onEndRef.current) {
                onEndRef.current();
                onEndRef.current = null;
            }
            setCurrentMove(null);
        },
    }), [animationSpeed]);

    useEffect(() => {
        if (!currentMove) {
            api.set({ rotation: [0, 0, 0] });
        }
    }, [currentMove, api]);

    const triggerRotate = (move: string, onEnd?: () => void) => {
        if (isAnimating) return onEnd?.();
        setIsAnimating(true);
        setCurrentMove(move);
        onEndRef.current = () => {
            setCubies(prev => rotateCubies(prev, move));
            onEnd?.();
        };
        const { axis, angle } = getRotationParams(move);
        const rotation: [number, number, number] = [
            axis[0] * angle,
            axis[1] * angle,
            axis[2] * angle,
        ];
        setTimeout(() => {
            api.start({
                to: { rotation },
                from: { rotation: [0, 0, 0] },
            });
        }, 10);
    };

    const { animatedCubies, staticCubies } = useMemo(() => {
        if (!currentMove) return { animatedCubies: [], staticCubies: cubies };
        if (["X", "Y", "Z"].includes(currentMove)) return { animatedCubies: cubies, staticCubies: [] };
        const animated = getAnimatedCubies(currentMove, cubies);
        return {
            animatedCubies: animated,
            staticCubies: cubies.filter(c => !animated.includes(c))
        };
    }, [cubies, currentMove]);

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