import type { SolvingStage, SolvingStep } from "../types/cube";
import "../styles/SolvingGuide.css";

interface SolvingGuideProps {
  currentStage: SolvingStage;
  currentStep: SolvingStep;
  progress: number;
  hints: string[];
  onAlgorithmClick?: (algorithm: string[]) => void;
}

export function SolvingGuide({
  currentStage,
  currentStep,
  progress,
  hints,
  onAlgorithmClick,
}: SolvingGuideProps) {
  return (
    <div className="solving-guide">
      <div className="progress-section">
        <h3>总体进度</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{progress.toFixed(1)}%</span>
      </div>

      <div className="current-stage">
        <h3>当前阶段：{currentStage.name}</h3>
        <p>{currentStage.description}</p>
      </div>

      <div className="current-step">
        <h4>当前步骤：{currentStep.name}</h4>
        <p>{currentStep.description}</p>

        {currentStep.algorithm && (
          <div className="algorithm">
            <h5>推荐公式</h5>
            <button
              className="algorithm-btn"
              onClick={() => onAlgorithmClick?.(currentStep.algorithm!)}
            >
              {currentStep.algorithm.join(" ")}
            </button>
          </div>
        )}

        <div className="hints">
          <h5>提示</h5>
          <ul>
            {hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
