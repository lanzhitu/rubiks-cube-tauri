interface ControlPanelProps {
  isAnimating: boolean;
  isAutoPlaying: boolean;
  isPaused: boolean;
  toggleAutoPlay: () => void;
  animationSpeed: number;
  changeAnimationSpeed: (speed: number) => void;
  randomize: () => Promise<void>;
  reset: () => Promise<void>;
  solveFullWithAnimation: () => Promise<void>;
  handleMoves: (moves: string[], syncBackend?: boolean) => void;
  resetSteps: () => void;
  currentStageIndex: number;
  continueNextStage: () => void;
}

export function ControlPanel({
  isAnimating,
  isAutoPlaying,
  isPaused,
  toggleAutoPlay,
  animationSpeed,
  changeAnimationSpeed,
  randomize,
  reset,
  solveFullWithAnimation,
  handleMoves,
  resetSteps,
  currentStageIndex,
  continueNextStage,
}: ControlPanelProps) {
  return (
    <div className="controls-container">
      <h1>魔方层先法教学</h1>
      <div className="control-group">
        <h2>基本操作</h2>
        <button onClick={randomize} disabled={isAnimating}>
          打乱魔方
        </button>
        <button onClick={reset} disabled={isAnimating}>
          重置魔方
        </button>
        <button onClick={resetSteps} disabled={isAnimating}>
          重新获取分步解法
        </button>
      </div>
      <div className="control-group">
        <h2>解法控制</h2>
        <button
          onClick={solveFullWithAnimation}
          disabled={isAnimating}
          className="solve-full-btn"
        >
          完整解魔方
        </button>
        <button onClick={toggleAutoPlay} disabled={isAnimating}>
          {isPaused ? "继续" : isAutoPlaying ? "暂停" : "开始分步解魔方"}
        </button>
        {isPaused && (
          <button onClick={continueNextStage} disabled={isAnimating}>
            确认并进入下一步
          </button>
        )}
        <div className="current-stage">第 {currentStageIndex + 1} 步</div>
      </div>
      <div className="control-group">
        <h2>动画速度</h2>
        <div className="speed-controls">
          {[0.5, 1, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => changeAnimationSpeed(speed)}
              className={animationSpeed === speed ? "active" : ""}
              disabled={isAnimating}
            >
              {speed === 0.5 ? "慢速" : speed === 1 ? "正常" : "快速"}
            </button>
          ))}
        </div>
      </div>
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
            disabled={isAnimating}
          >
            执行
          </button>
        </div>
      </div>
    </div>
  );
}
