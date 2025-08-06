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
