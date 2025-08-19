import "../styles/SolvingGuide.css";

interface SolvingGuideProps {
  currentStageIndex: number;
  progress: number;
  hints: string[];
  onAlgorithmClick: (moves: string[] | null, syncBackend?: boolean) => void;
}

export function SolvingGuide({
  currentStageIndex,
  progress,
  hints,
  onAlgorithmClick,
}: SolvingGuideProps) {
  return (
    <div className="solving-guide">
      {/* 进度部分 */}
      <div className="progress-section">
        <h3>解魔方进度</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="step-counter">当前步骤: {currentStageIndex}</div>
      </div>

      {/* 提示部分 */}
      <div className="hints">
        <h4>操作提示</h4>
        <ul>
          {hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </div>

      {/* 控制按钮 */}
      <div className="controls">
        <button
          className="algorithm-btn"
          onClick={() => onAlgorithmClick(null)}
          disabled={progress === 100}
        >
          执行下一步
        </button>
      </div>
    </div>
  );
}
