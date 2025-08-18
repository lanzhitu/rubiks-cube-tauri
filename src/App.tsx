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
  useResetOnUnload();
  const cube3DRef = useRef<any>(null);
  const solvingManager = useRef(new SolvingManager());

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [cubeState, setCubeState] = useState("");
  const [backendState, setBackendState] = useState("");
  const [syncResult, setSyncResult] = useState<string>("");
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentHints, setCurrentHints] = useState<string[]>([]);

  // 集成分步解法相关状态和方法
  const {
    handleMoves,
    syncAndUpdate,
    solveAndAnimate,
    solveFullWithAnimation,
    randomize,
    reset,
    changeAnimationSpeed,
    solutionSteps,
    currentStep,
    setCurrentStep,
    isAutoPlaying,
    toggleAutoPlay,
    onStepSolve,
    resetSteps,
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
        solutionSteps={solutionSteps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isAutoPlaying={isAutoPlaying}
        toggleAutoPlay={toggleAutoPlay}
        onStepSolve={onStepSolve}
        resetSteps={resetSteps}
      />
      <SolvingGuide
        currentStep={currentStep}
        progress={currentProgress}
        hints={currentHints}
        onAlgorithmClick={handleMoves}
      />
    </div>
  );
}

export default App;
