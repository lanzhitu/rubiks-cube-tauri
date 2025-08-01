import React, { useRef, useState } from "react";
import Cube3D from "./components/Cube3D";
import {
  getCubeState as getBackendCubeState,
  rotateCube,
  resetCube,
  solveCube,
  scrambleCube,
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

  // 页面初始化时重置后端魔方数据，并定时刷新 CubeState
  React.useEffect(() => {
    // 初始化时重置后端魔方
    (async () => {
      try {
        await resetCube();
        await checkSync();
      } catch (e) {
        console.error("后端魔方重置失败", e);
      }
    })();
    // 定时刷新 CubeState
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
  // 完整解魔方：自动调用后端求解接口并动画执行
  const solveFullWithAnimation = async () => {
    if (isAnimating) return;
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
  };

  const changeAnimationSpeed = (speed: number) => {
    setAnimationSpeed(speed);
  };

  // 打乱魔方：同步打乱后端和前端状态
  const randomize = async () => {
    if (isAnimating) return;
    try {
      const scrambledState = await scrambleCube(); // 后端打乱，获取新状态
      if (cube3DRef.current && cube3DRef.current.setState) {
        cube3DRef.current.setState(scrambledState); // 前端同步新状态
      } else {
        window.location.reload(); // 无setState方法则刷新页面
      }
      await checkSync();
    } catch (e) {
      alert("打乱失败");
    }
  };
  // 重置魔方：同步重置后端和前端状态
  const reset = async () => {
    if (isAnimating) return;
    try {
      await resetCube(); // 后端重置
      if (cube3DRef.current && cube3DRef.current.setToDefault) {
        cube3DRef.current.setToDefault(); // 前端 Cubie 状态重置（需组件支持）
      } else {
        // 若无 setToDefault，可刷新页面或重新初始化 cubies
        window.location.reload();
      }
      await checkSync();
    } catch (e) {
      alert("重置失败");
    }
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

      <div className="controls-container">
        <h1>魔方CFOP教学与解法</h1>

        <div className="control-group">
          <h2>基本操作</h2>
          <button onClick={randomize} disabled={isAnimating}>
            打乱魔方
          </button>
          <button onClick={reset} disabled={isAnimating}>
            重置魔方
          </button>
        </div>

        <div className="control-group">
          <h2>CFOP解法步骤</h2>
          <button onClick={solveAndAnimate} disabled={isAnimating}>
            解底部十字
          </button>
          <button onClick={solveAndAnimate} disabled={isAnimating}>
            解F2L
          </button>
          <button onClick={solveAndAnimate} disabled={isAnimating}>
            解顶层朝向
          </button>
          <button onClick={solveAndAnimate} disabled={isAnimating}>
            解顶层排列
          </button>
          <button
            onClick={solveFullWithAnimation}
            disabled={isAnimating}
            className="solve-full-btn"
          >
            完整解魔方
          </button>
        </div>

        {/* 动画速度控制 */}
        <div className="control-group">
          <h2>动画速度</h2>
          <div className="speed-controls">
            <button
              onClick={() => changeAnimationSpeed(0.5)}
              className={animationSpeed === 0.5 ? "active" : ""}
              disabled={isAnimating}
            >
              慢速
            </button>
            <button
              onClick={() => changeAnimationSpeed(1)}
              className={animationSpeed === 1 ? "active" : ""}
              disabled={isAnimating}
            >
              正常
            </button>
            <button
              onClick={() => changeAnimationSpeed(2)}
              className={animationSpeed === 2 ? "active" : ""}
              disabled={isAnimating}
            >
              快速
            </button>
          </div>
        </div>

        {/* 解法步骤显示已移除 */}

        <div className="control-group">
          <h2>手动操作</h2>
          <div className="manual-moves">
            {[..."UuDdLlRrFfBb"].map((char, index) => {
              const move =
                index % 2 === 0 ? char.toUpperCase() : char.toUpperCase() + "'";
              return (
                <button
                  key={move}
                  onClick={() => handleMoves([move])}
                  disabled={isAnimating}
                >
                  {move}
                </button>
              );
            })}
          </div>
        </div>

        <div className="control-group">
          <h2>执行公式</h2>
          <div className="algorithm-input">
            <input
              type="text"
              id="algorithm-input"
              placeholder="例如: R U R' U'"
            />
            <button
              onClick={() => {
                const input = document.getElementById(
                  "algorithm-input"
                ) as HTMLInputElement;
                if (input) {
                  handleMoves(input.value.split(" ").filter(Boolean));
                }
              }}
            ></button>
          </div>
        </div>
        <div className="control-group">
          <h2>调试信息</h2>
          <button onClick={checkSync} disabled={isAnimating}>
            检测前后端状态同步
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
