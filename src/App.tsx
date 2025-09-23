import { useRef, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { useCubeActions } from "./hooks/useCubeActions";
import Cube3D from "./components/Cube3D";
import { SolvingGuide } from "./components/SolvingGuide";
import { SolvingManager } from "./utils/solvingManager";
import { useResetOnUnload } from "./hooks/useResetOnUnload";
import { SOLVING_STAGES } from "./constants/solvingStage";
import "./App.css";

function App() {
  useResetOnUnload();
  const cube3DRef = useRef<any>(null);
  const solvingManager = useRef(new SolvingManager());

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentHints, setCurrentHints] = useState<string[]>([]);

  const {
    handleMoves,
    solveFullWithAnimation,
    randomize,
    reset,
    changeAnimationSpeed,
    currentStageIndex,
    solveCurrentStageWithAnimation,
    solveCurrentStageStep,
    setStageIndex,
  } = useCubeActions({
    cube3DRef,
    solvingManager,
    setIsAnimating,
    setCurrentProgress,
    setCurrentHints,
    animationSpeed,
    setAnimationSpeed,
  });

  return (
    <div className="app-container">
      {(() => {
        const currentStage =
          SOLVING_STAGES[currentStageIndex] || SOLVING_STAGES[0];
        return (
          <SolvingGuide
            currentStageIndex={currentStageIndex}
            progress={currentProgress}
            hints={currentHints}
            onAlgorithmClick={solveCurrentStageWithAnimation}
            stageName={currentStage.name}
            stageDescription={currentStage.description}
            algorithms={currentStage.algorithm || []}
            setStageIndex={setStageIndex}
          />
        );
      })()}
      <div className="cube-container">
        <Cube3D ref={cube3DRef} animationSpeed={animationSpeed} />
      </div>
      <ControlPanel
        isAnimating={isAnimating}
        animationSpeed={animationSpeed}
        changeAnimationSpeed={changeAnimationSpeed}
        randomize={randomize}
        reset={reset}
        solveFullWithAnimation={solveFullWithAnimation}
        solveCurrentStage={solveCurrentStageWithAnimation}
        solveCurrentStageStep={solveCurrentStageStep}
        handleMoves={handleMoves}
        currentStageIndex={currentStageIndex}
      />
    </div>
  );
}

export default App;
