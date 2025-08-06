import { useEffect } from "react";

export function useResetOnUnload() {
    useEffect(() => {
        const handleUnload = async () => {
            const { resetCube } = await import("../services/cubeApi");
            try {
                await resetCube();
            } catch (e) {
                console.warn("后端重置魔方失败", e);
            }
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);
}
