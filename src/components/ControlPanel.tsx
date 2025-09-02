import { useState } from "react";

interface ControlPanelProps {
  isAnimating: boolean;
  animationSpeed: number;
  changeAnimationSpeed: (speed: number) => void;
  randomize: () => Promise<void>;
  reset: () => Promise<void>;
  solveFullWithAnimation: () => Promise<void>;
  solveCurrentStage: () => void;
  handleMoves: (moves: string[], syncBackend?: boolean) => void;
  currentStageIndex: number;
}

export function ControlPanel({
  isAnimating,
  animationSpeed,
  changeAnimationSpeed,
  randomize,
  reset,
  solveFullWithAnimation,
  solveCurrentStage,
  handleMoves,
  currentStageIndex,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "moves" | "settings">(
    "basic"
  );

  return (
    <div className="controls-sidebar">
      {/* 侧边栏标签 */}
      <div className="side-tabs">
        <button
          className={`tab-btn ${activeTab === "basic" ? "active" : ""}`}
          onClick={() => setActiveTab("basic")}
        >
          基本
        </button>
        <button
          className={`tab-btn ${activeTab === "moves" ? "active" : ""}`}
          onClick={() => setActiveTab("moves")}
        >
          操作
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          设置
        </button>
      </div>

      {/* 主要内容区域 */}
      <div className="control-content">
        {activeTab === "basic" && (
          <div className="basic-controls">
            <div className="stage-info">阶段 {currentStageIndex + 1}</div>
            <button
              onClick={randomize}
              disabled={isAnimating}
              className="control-btn"
            >
              打乱
            </button>
            <button
              onClick={reset}
              disabled={isAnimating}
              className="control-btn"
            >
              重置
            </button>
            <button
              onClick={solveFullWithAnimation}
              disabled={isAnimating}
              className="control-btn primary"
            >
              解魔方
            </button>
            <button
              onClick={solveCurrentStage}
              disabled={isAnimating}
              className="control-btn"
            >
              执行
            </button>
          </div>
        )}

        {activeTab === "moves" && (
          <div className="moves-controls">
            <div className="move-grid">
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
                  className="move-btn"
                >
                  {move}
                </button>
              ))}
            </div>
            <div className="xyz-rotate">
              {["X", "Y", "Z"].map((move) => (
                <button
                  key={move}
                  onClick={() => handleMoves([move])}
                  disabled={isAnimating}
                  className="move-btn rotate"
                >
                  {move}
                </button>
              ))}
            </div>
            <div className="algorithm-box">
              <input
                type="text"
                className="algo-input"
                placeholder="R U R' U'"
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    ".algo-input"
                  ) as HTMLInputElement;
                  if (input?.value) {
                    handleMoves(input.value.split(" ").filter(Boolean));
                    input.value = "";
                  }
                }}
                disabled={isAnimating}
                className="execute-btn"
              >
                执行
              </button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-controls">
            <div className="speed-buttons">
              {[0.5, 1, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeAnimationSpeed(speed)}
                  className={`speed-btn ${
                    animationSpeed === speed ? "active" : ""
                  }`}
                  disabled={isAnimating}
                >
                  {speed === 0.5 ? "慢速" : speed === 1 ? "正常" : "快速"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
