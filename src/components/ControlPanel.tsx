interface ControlPanelProps {
  currentStep: number;
  onStepSolve: (step: number) => void;
  isAnimating: boolean;
  animationSpeed: number;
  changeAnimationSpeed: (speed: number) => void;
  randomize: () => void;
  reset: () => void;
  solveAndAnimate: () => void;
  solveFullWithAnimation: () => void;
  handleMoves: (moves: string[], syncBackend?: boolean) => void;
}

export function ControlPanel({
  isAnimating,
  animationSpeed,
  changeAnimationSpeed,
  randomize,
  reset,
  solveFullWithAnimation,
  handleMoves,
  currentStep,
  onStepSolve,
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
      </div>
      <div className="control-group">
        <h2>CFOP分步解法</h2>
        <button
          onClick={() => onStepSolve(0)}
          disabled={isAnimating || currentStep !== 0}
        >
          第一步：解底部十字
        </button>
        <button
          onClick={() => onStepSolve(1)}
          disabled={isAnimating || currentStep !== 1}
        >
          第二步：解底部四角
        </button>
        <button
          onClick={() => onStepSolve(2)}
          disabled={isAnimating || currentStep !== 2}
        >
          第三步：解第二层
        </button>
        <button
          onClick={() => onStepSolve(3)}
          disabled={isAnimating || currentStep !== 3}
        >
          第四步：解顶层十字
        </button>
        <button
          onClick={() => onStepSolve(4)}
          disabled={isAnimating || currentStep !== 4}
        >
          第五步：顶层十字归位
        </button>
        <button
          onClick={() => onStepSolve(5)}
          disabled={isAnimating || currentStep !== 5}
        >
          第六步：顶层四角归位
        </button>
        <button
          onClick={() => onStepSolve(6)}
          disabled={isAnimating || currentStep !== 6}
        >
          第七步：顶层四角转向
        </button>
        <button
          onClick={solveFullWithAnimation}
          disabled={isAnimating}
          className="solve-full-btn"
        >
          完整解魔方
        </button>
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
