import React, { useRef, useState } from "react";
import Cube3D from "./components/Cube3D";
import {
  getCubeState as getBackendCubeState,
  rotateCube,
} from "./services/cubeApi";
import "./App.css";

function App() {
  console.log("App component rendering");
  const cube3DRef = useRef<any>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [cubeState, setCubeState] = useState("");
  const [backendState, setBackendState] = useState("");
  const [syncResult, setSyncResult] = useState<string>("");
  // 校验前端与后端魔方状态是否同步
  // 同步检测并显示前后端状态
  // 每次旋转后自动检测同步并显示匹配提示
  const checkSync = async () => {
    if (!cube3DRef.current || !cube3DRef.current.getCubeState) return;
    const frontendState = cube3DRef.current.getCubeState();
    const backend = await getBackendCubeState();
    setCubeState(frontendState);
    setBackendState(backend);
    setSyncResult(frontendState === backend ? "match" : "mismatch");
  };

  // 定时刷新 CubeState
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (cube3DRef.current && cube3DRef.current.getCubeState) {
        setCubeState(cube3DRef.current.getCubeState());
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // 不再需要初始化faceColors和后端状态

  // 只负责动画和交互，不再处理魔方状态
  // 每次旋转后自动检测同步
  // 每次旋转时，前后端都同步操作
  const handleMoves = (moves: string[] | null) => {
    if (isAnimating || !moves || moves.length === 0) return;
    let currentMoveIndex = 0;
    const processNextMove = async () => {
      if (currentMoveIndex >= moves.length) {
        setIsAnimating(false);
        await checkSync(); // 旋转全部完成后再检测一次
        return;
      }
      setIsAnimating(true);
      const move = moves[currentMoveIndex];
      if (!cube3DRef.current) {
        setIsAnimating(false);
        return;
      }
      // 前端动画
      cube3DRef.current.triggerLayerRotate(move, async () => {
        // 后端同步旋转
        await rotateCube(move);
        await checkSync(); // 每次旋转后检测一次
        currentMoveIndex++;
        processNextMove();
      });
    };
    processNextMove();
  };

  // 演示用：CFOP和完整解法按钮仅做动画演示
  const solveAndAnimate = () => {
    if (isAnimating) return;
    // 示例：U U' U U'
    handleMoves(["U", "U'", "U", "U'"]);
  };
  const solveFullWithAnimation = () => {
    if (isAnimating) return;
    handleMoves(["U", "U'", "U", "U'"]);
  };

  const changeAnimationSpeed = (speed: number) => {
    setAnimationSpeed(speed);
  };

  // 随机和重置仅做动画演示
  const randomize = () => {
    if (isAnimating) return;
    handleMoves(["U", "U", "U'", "U'"]);
  };
  const reset = () => {
    if (isAnimating) return;
    handleMoves(["U", "U'", "U", "U'"]);
  };

  return (
    <div className="app-container">
      <div className="cube-container">
        <Cube3D ref={cube3DRef} animationSpeed={animationSpeed} />
        {/* 调试视图：实时显示前后端 CubeState，每次旋转后自动提示匹配情况 */}
        <div
          style={{
            marginTop: 0,
            padding: 8,
            background: "#000000",
            borderRadius: 4,
          }}
        >
          <strong>调试：CubeState</strong>
          <div>
            <div
              style={{
                wordBreak: "break-all",
                fontFamily: "monospace",
                fontSize: 14,
                background: "#111",
                padding: 4,
                borderRadius: 2,
                marginBottom: 12,
                maxHeight: 80,
                overflowY: "auto",
              }}
            >
              前端：{cubeState}
            </div>
            <div
              style={{
                wordBreak: "break-all",
                fontFamily: "monospace",
                fontSize: 14,
                background: "#111",
                padding: 4,
                borderRadius: 2,
                maxHeight: 80,
                overflowY: "auto",
              }}
            >
              后端：{backendState}
            </div>
          </div>
          {syncResult === "match" && (
            <div style={{ marginTop: 8, color: "#0f0", fontWeight: "bold" }}>
              ✅ 状态一致
            </div>
          )}
          {syncResult === "mismatch" && (
            <div style={{ marginTop: 8, color: "#f00", fontWeight: "bold" }}>
              ❌ 状态不一致
            </div>
          )}
        </div>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {cubeState && <pre>{JSON.stringify(cubeState, null, 2)}</pre>}
    </>
  )
}

export default App
