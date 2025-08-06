interface ControlPanelProps {
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
  solveAndAnimate,
  solveFullWithAnimation,
  handleMoves,
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
        <h2>CFOP解法步骤</h2>
        <button onClick={solveAndAnimate} disabled={isAnimating}>
          解底部十字
        </button>
        <button onClick={solveAndAnimate} disabled={isAnimating}>
          解F2L
        </button>
        <button onClick={solveAndAnimate} disabled={isAnimating}>
          解顶层朝向
        </button>
        <button onClick={solveAndAnimate} disabled={isAnimating}>
          解顶层排列
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
