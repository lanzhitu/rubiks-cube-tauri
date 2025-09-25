import { useEffect, useRef, useState } from "react";
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
  const [stageIdx, setStageIdx] = useState(0);

  const {
    handleMoves,
    solveFullWithAnimation,
    randomize,
    reset,
    changeAnimationSpeed,
    currentStageIndex,
    solveCurrentStageWithAnimation,
    solveCurrentStageStep,
  } = useCubeActions({
    cube3DRef,
    solvingManager,
    setIsAnimating,
    setAnimationSpeed,
  });

  // 只维护阶段索引，其他都从 SOLVING_STAGES 派生
  const totalStages = SOLVING_STAGES.length;
  const currentStage = SOLVING_STAGES[stageIdx] || SOLVING_STAGES[0];

  const handleAlgorithmClick = () => {
    solveCurrentStageWithAnimation();
  };

  // 动画结束后UI自动跟随魔方实际进度
  useEffect(() => {
    if (!isAnimating) {
      setStageIdx(currentStageIndex);
    }
  }, [isAnimating, currentStageIndex]);

  return (
    <div className="app-container">
      <SolvingGuide
        currentStageIndex={stageIdx}
        progress={Math.floor((stageIdx / totalStages) * 100)}
        hints={currentStage.hints || []}
        onAlgorithmClick={handleAlgorithmClick}
        stageName={currentStage.name}
        stageDescription={currentStage.description}
        algorithms={currentStage.algorithm || []}
        onStageChange={setStageIdx}
        totalStages={totalStages}
      />
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
