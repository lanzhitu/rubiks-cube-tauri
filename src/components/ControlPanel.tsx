import { useState } from "react";
import { SOLVING_STAGES } from "../constants/solvingStage";
import theme from "../styles/theme";

interface ControlPanelProps {
  isAnimating: boolean;
  animationSpeed: number;
  changeAnimationSpeed: (speed: number) => void;
  randomize: () => Promise<void>;
  reset: () => Promise<void>;
  solveFullWithAnimation: () => Promise<void>;
  solveCurrentStage: () => void;
  solveCurrentStageStep: () => Promise<void>;
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
  solveCurrentStageStep,
  handleMoves,
  currentStageIndex,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "moves" | "settings">(
    "basic"
  );

  return (
    <div
      className="controls-sidebar"
      style={{
        background: theme.surface,
        color: theme.textPrimary,
        borderRadius: 16,
        boxShadow: `0 2px 16px ${theme.border}`,
        fontFamily: "system-ui, sans-serif",
        padding: "24px 18px",
        minWidth: 260,
        maxWidth: 340,
      }}
    >
      {/* 侧边栏标签 */}
      <div className="side-tabs" style={{ display: "flex", marginBottom: 18 }}>
        {["basic", "moves", "settings"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab as any)}
            style={{
              flex: 1,
              padding: "10px 0",
              background: activeTab === tab ? theme.primary : theme.surface,
              color: activeTab === tab ? theme.background : theme.textPrimary,
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              marginRight: tab !== "settings" ? 8 : 0,
              cursor: "pointer",
              boxShadow:
                activeTab === tab ? `0 2px 8px ${theme.border}` : "none",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {tab === "basic" ? "基本" : tab === "moves" ? "操作" : "设置"}
          </button>
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className="control-content">
        {activeTab === "basic" && (
          <div className="basic-controls">
            <div
              className="stage-info"
              style={{
                marginBottom: 16,
                color: theme.accent,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              阶段 {currentStageIndex + 1}:{" "}
              {SOLVING_STAGES[currentStageIndex]?.name || "未知阶段"}
            </div>
            <button
              onClick={randomize}
              disabled={isAnimating}
              className="control-btn"
              style={{
                background: theme.primary,
                color: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 10,
                width: "100%",
                cursor: isAnimating ? "not-allowed" : "pointer",
                opacity: isAnimating ? 0.5 : 1,
                boxShadow: `0 2px 12px ${theme.primary}44`,
                transition: "background 0.2s, color 0.2s, opacity 0.2s",
                letterSpacing: 1,
              }}
            >
              打乱
            </button>
            <button
              onClick={reset}
              disabled={isAnimating}
              className="control-btn"
              style={{
                background: theme.surface,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 10,
                width: "100%",
                cursor: isAnimating ? "not-allowed" : "pointer",
                opacity: isAnimating ? 0.5 : 1,
                boxShadow: `0 2px 8px ${theme.border}`,
                transition: "background 0.2s, color 0.2s, opacity 0.2s",
              }}
            >
              重置
            </button>
            <button
              onClick={solveFullWithAnimation}
              disabled={isAnimating}
              className="control-btn primary"
              style={{
                background: theme.surface,
                color: theme.primary,
                border: `1px solid ${theme.primary}`,
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 10,
                width: "100%",
                cursor: isAnimating ? "not-allowed" : "pointer",
                opacity: isAnimating ? 0.5 : 1,
                boxShadow: `0 2px 8px ${theme.primary}44`,
                transition: "background 0.2s, color 0.2s, opacity 0.2s",
              }}
            >
              解魔方
            </button>
            <button
              onClick={solveCurrentStage}
              disabled={isAnimating}
              className="control-btn"
              style={{
                background: theme.accent,
                color: theme.background,
                border: `1px solid ${theme.accent}`,
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 10,
                width: "100%",
                cursor: isAnimating ? "not-allowed" : "pointer",
                opacity: isAnimating ? 0.5 : 1,
                boxShadow: `0 2px 12px ${theme.accent}44`,
                transition: "background 0.2s, color 0.2s, opacity 0.2s",
                letterSpacing: 1,
              }}
            >
              分阶执行
            </button>
            <button
              onClick={solveCurrentStageStep}
              disabled={isAnimating}
              className="control-btn"
              style={{
                background: theme.primary,
                color: theme.background,
                border: `1px solid ${theme.primary}`,
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 700,
                fontSize: 16,
                width: "100%",
                cursor: isAnimating ? "not-allowed" : "pointer",
                opacity: isAnimating ? 0.5 : 1,
                boxShadow: `0 2px 12px ${theme.primary}44`,
                transition: "background 0.2s, color 0.2s, opacity 0.2s",
                letterSpacing: 1,
              }}
            >
              单步执行
            </button>
          </div>
        )}

        {activeTab === "moves" && (
          <div className="moves-controls">
            <div
              className="move-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 8,
                marginBottom: 12,
              }}
            >
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
                  style={{
                    background: theme.surface,
                    color: theme.textPrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 15,
                    padding: "8px 0",
                    cursor: isAnimating ? "not-allowed" : "pointer",
                    opacity: isAnimating ? 0.5 : 1,
                    boxShadow: `0 1px 4px ${theme.border}`,
                    transition: "background 0.2s, color 0.2s, opacity 0.2s",
                  }}
                >
                  {move}
                </button>
              ))}
            </div>
            <div
              className="xyz-rotate"
              style={{ display: "flex", gap: 8, marginBottom: 12 }}
            >
              {["X", "Y", "Z"].map((move) => (
                <button
                  key={move}
                  onClick={() => handleMoves([move])}
                  disabled={isAnimating}
                  className="move-btn rotate"
                  style={{
                    background: theme.primary,
                    color: theme.background,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 15,
                    padding: "8px 0",
                    cursor: isAnimating ? "not-allowed" : "pointer",
                    opacity: isAnimating ? 0.5 : 1,
                    boxShadow: `0 1px 4px ${theme.border}`,
                    transition: "background 0.2s, color 0.2s, opacity 0.2s",
                  }}
                >
                  {move}
                </button>
              ))}
            </div>
            <div
              className="algorithm-box"
              style={{ display: "flex", gap: 8, marginBottom: 12 }}
            >
              <input
                type="text"
                className="algo-input"
                placeholder="R U R' U'"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 6,
                  border: `1px solid ${theme.border}`,
                  fontSize: 15,
                  background: theme.background,
                  color: theme.textPrimary,
                  fontWeight: 500,
                }}
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
                style={{
                  background: theme.accent,
                  color: theme.background,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 15,
                  padding: "8px 16px",
                  cursor: isAnimating ? "not-allowed" : "pointer",
                  opacity: isAnimating ? 0.5 : 1,
                  boxShadow: `0 1px 4px ${theme.border}`,
                  transition: "background 0.2s, color 0.2s, opacity 0.2s",
                }}
              >
                执行
              </button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-controls">
            <div className="speed-buttons" style={{ display: "flex", gap: 8 }}>
              {[0.5, 1, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeAnimationSpeed(speed)}
                  className={`speed-btn ${
                    animationSpeed === speed ? "active" : ""
                  }`}
                  disabled={isAnimating}
                  style={{
                    flex: 1,
                    background:
                      animationSpeed === speed ? theme.primary : theme.surface,
                    color:
                      animationSpeed === speed
                        ? theme.background
                        : theme.textPrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 15,
                    padding: "10px 0",
                    cursor: isAnimating ? "not-allowed" : "pointer",
                    opacity: isAnimating ? 0.5 : 1,
                    boxShadow:
                      animationSpeed === speed
                        ? `0 2px 8px ${theme.border}`
                        : "none",
                    transition: "background 0.2s, color 0.2s, opacity 0.2s",
                  }}
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
