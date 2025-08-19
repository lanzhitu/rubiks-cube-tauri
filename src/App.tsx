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

  const {
    handleMoves,
    syncAndUpdate,
    solveFullWithAnimation,
    randomize,
    reset,
    changeAnimationSpeed,
    currentStageIndex,
    solveCurrentStageWithAnimation,
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
        solveFullWithAnimation={solveFullWithAnimation}
        solveCurrentStage={solveCurrentStageWithAnimation}
        handleMoves={handleMoves}
        currentStageIndex={currentStageIndex}
      />
      <SolvingGuide
        currentStageIndex={currentStageIndex}
        progress={currentProgress}
        hints={currentHints}
        onAlgorithmClick={handleMoves}
      />
    </div>
  );
}

export default App;
