import React, { useRef, useState, useEffect } from "react";
import Cube3D from "./components/Cube3D";
import { SolvingGuide } from "./components/SolvingGuide";
import { SolvingManager } from "./utils/solvingManager";
import {
  getCubeState as getBackendCubeState,
  rotateCube,
  resetCube,
  solveCube,
  scrambleCube,
} from "./services/cubeApi";
import { parseCubeState, SOLVED_STATE } from "./utils/cubeUtils";
import type { CubeState } from "./types/cube";
import "./App.css";

function App() {
  console.log("App component rendering");
  const cube3DRef = useRef<any>(null);
  const solvingManager = useRef(new SolvingManager());

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [cubeState, setCubeState] = useState("");
  const [backendState, setBackendState] = useState("");
  const [syncResult, setSyncResult] = useState<string>("");

  // 解魔方状态
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentHints, setCurrentHints] = useState<string[]>([]);

  // 合并同步与进度更新
  const syncAndUpdate = async () => {
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
  };

  useEffect(() => {
    (async () => {
      try {
        await resetCube();
        await syncAndUpdate();
        solvingManager.current.reset();
      } catch (e) {
        console.error("后端魔方重置失败", e);
      }
    })();
    const timer = setInterval(async () => {
      if (cube3DRef.current && cube3DRef.current.getCubeState) {
        setCubeState(cube3DRef.current.getCubeState());
        const cubeStateObj: CubeState = {
          raw: cube3DRef.current.getCubeState(),
          faces: parseCubeState(cube3DRef.current.getCubeState()),
          isSolved: cube3DRef.current.getCubeState() === SOLVED_STATE,
        };
        solvingManager.current.updateProgress(cubeStateObj);
        setCurrentProgress(solvingManager.current.getProgress());
        setCurrentHints(solvingManager.current.getCurrentHints());
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // 支持是否同步后端
  const handleMoves = (moves: string[] | null, syncBackend: boolean = true) => {
    if (isAnimating || !moves || moves.length === 0) return;
    let currentMoveIndex = 0;
    const processNextMove = async () => {
      if (currentMoveIndex >= moves.length) {
        setIsAnimating(false);
        if (syncBackend) await syncAndUpdate();
        else {
          // 只更新前端进度
          const state = cube3DRef.current?.getCubeState();
          if (state) {
            const cubeStateObj: CubeState = {
              raw: state,
              faces: parseCubeState(state),
              isSolved: state === SOLVED_STATE,
            };
            solvingManager.current.updateProgress(cubeStateObj);
            setCurrentProgress(solvingManager.current.getProgress());
            setCurrentHints(solvingManager.current.getCurrentHints());
          }
        }
        return;
      }
      setIsAnimating(true);
      const move = moves[currentMoveIndex];
      if (!cube3DRef.current) {
        setIsAnimating(false);
        return;
      }
      cube3DRef.current.triggerRotate(move, async () => {
        if (syncBackend) await rotateCube(move);
        if (syncBackend) await syncAndUpdate();
        else {
          const state = cube3DRef.current?.getCubeState();
          if (state) {
            const cubeStateObj: CubeState = {
              raw: state,
              faces: parseCubeState(state),
              isSolved: state === SOLVED_STATE,
            };
            solvingManager.current.updateProgress(cubeStateObj);
            setCurrentProgress(solvingManager.current.getProgress());
            setCurrentHints(solvingManager.current.getCurrentHints());
          }
        }
        currentMoveIndex++;
        processNextMove();
      });
    };
    processNextMove();
  };

  // 演示用：CFOP和完整解法按钮仅做动画演示
  const solveAndAnimate = () => {
    if (isAnimating) return;
    handleMoves(["U", "U'", "U", "U'"]);
  };
  // 完整解魔方：自动调用后端求解接口并动画执行
  const solveFullWithAnimation = async () => {
    if (isAnimating) return;
    try {
      // 可扩展：如需前置旋转 handleMoves(["X", "X"], false)
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

  const changeAnimationSpeed = (speed: number) => setAnimationSpeed(speed);

  const randomize = async () => {
    if (isAnimating) return;
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
  };
  const reset = async () => {
    if (isAnimating) return;
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
        <h1>魔方层先法教学</h1>

        {/* 解魔方指导面板 */}
        <SolvingGuide
          currentStage={solvingManager.current.getCurrentStage()}
          currentStep={solvingManager.current.getCurrentStep()}
          progress={currentProgress}
          hints={currentHints}
          onAlgorithmClick={handleMoves}
        />

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
            {[
              "U",
              "U'",
              "D",
              "D'",
              "L",
              "L'",
              "R",
              "R'",
              "F",
              "F'",
              "B",
              "B'",
            ].map((move) => (
              <button
                key={move}
                onClick={() => handleMoves([move])}
                disabled={isAnimating}
              >
                {move}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <h2>整体旋转（XYZ轴）</h2>
          <div className="xyz-rotate-controls">
            {["X", "Y", "Z"].map((move) => (
              <button
                key={move}
                onClick={() => handleMoves([move])}
                disabled={isAnimating}
              >
                {move}轴 +90°
              </button>
            ))}
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
          <button onClick={syncAndUpdate} disabled={isAnimating}>
            检测前后端状态同步
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
