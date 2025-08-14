import { useRef, useState } from "react";
import { DebugPanel } from "./components/DebugPanel";
import { ControlPanel } from "./components/ControlPanel";
import { useCubeActions } from "./hooks/useCubeActions";
import Cube3D from "./components/Cube3D";
import { SolvingGuide } from "./components/SolvingGuide";
import { SolvingManager } from "./utils/solvingManager";
import { useResetOnUnload } from "./hooks/useResetOnUnload";
import "./App.css";

function App() {
  // 分步解法状态
  const [currentStep, setCurrentStep] = useState(0);

  // 分步解法按钮点击逻辑
  const onStepSolve = async (step: number) => {
    if (isAnimating) return;
    // 步骤名与后端API映射
    const stepApiMap = [
      "bottom_cross", // 0
      "white_corner", // 1
      "second_layer", // 2
      "top_cross", // 3
      "order_top_cross", // 4
      "order_top_corners", // 5
      "turn_top_corners", // 6
    ];
    const stepName = stepApiMap[step];
    try {
      // 请求后端获取该步解法指令
      const res = await fetch(`/api/solve/${stepName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: cubeState }),
      });
      const data = await res.json();
      const moves: string[] = data.moves || [];
      // 逐步动画执行指令
      for (const move of moves) {
        await new Promise((resolve) => {
          handleMoves([move]);
          // 假设动画完成后会自动setIsAnimating(false)
          const check = () => {
            if (!isAnimating) resolve(undefined);
            else setTimeout(check, 50);
          };
          check();
        });
        await syncAndUpdate();
      }
      // 校验该步是否完成（可根据后端返回或前端判断）
      // 这里假设后端返回stepFinished字段
      if (data.stepFinished) {
        setCurrentStep(step + 1);
      }
    } catch (e) {
      alert("分步解法失败: " + e);
    }
  };
  // 页面刷新时通知后端重置魔方状态（模块化）
  useResetOnUnload();
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

  // 使用 useCubeActions 简化所有魔方操作
  const {
    handleMoves,
    syncAndUpdate,
    solveAndAnimate,
    solveFullWithAnimation,
    randomize,
    reset,
    changeAnimationSpeed,
  } = useCubeActions({
    cube3DRef,
    solvingManager,
    setIsAnimating,
    setCubeState,
    setBackendState,
    setSyncResult,
    setCurrentProgress,
    setCurrentHints,
    animationSpeed,
    setAnimationSpeed,
  });

  return (
    <div className="app-container">
      <div className="cube-container">
        <Cube3D ref={cube3DRef} animationSpeed={animationSpeed} />
        <DebugPanel
          cubeState={cubeState}
          backendState={backendState}
          syncResult={syncResult}
          onSync={syncAndUpdate}
          isAnimating={isAnimating}
        />
      </div>
      <ControlPanel
        isAnimating={isAnimating}
        animationSpeed={animationSpeed}
        changeAnimationSpeed={changeAnimationSpeed}
        randomize={randomize}
        reset={reset}
        solveAndAnimate={solveAndAnimate}
        solveFullWithAnimation={solveFullWithAnimation}
        handleMoves={handleMoves}
        currentStep={currentStep}
        onStepSolve={onStepSolve}
      />
      <SolvingGuide
        currentStage={solvingManager.current.getCurrentStage()}
        currentStep={solvingManager.current.getCurrentStep()}
        progress={currentProgress}
        hints={currentHints}
        onAlgorithmClick={handleMoves}
      />
    </div>
  );
}

export default App;
