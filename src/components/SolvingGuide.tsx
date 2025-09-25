import "../styles/SolvingGuide.css";
import theme from "../styles/theme";

interface SolvingGuideProps {
  currentStageIndex: number;
  progress: number;
  hints: string[];
  onAlgorithmClick: () => void;
  stageName: string;
  stageDescription: string;
  algorithms: string[];
  onStageChange: (idx: number) => void;
  totalStages: number;
}

export function SolvingGuide({
  currentStageIndex,
  progress,
  hints,
  onAlgorithmClick,
  stageName,
  stageDescription,
  algorithms,
  onStageChange,
  totalStages,
}: SolvingGuideProps) {
  // 按钮配置
  const navButtons = [
    {
      label: "上一步",
      onClick: () => onStageChange(currentStageIndex - 1),
      disabled: currentStageIndex <= 0,
      primary: false,
    },
    {
      label: "下一步",
      onClick: () => onStageChange(currentStageIndex + 1),
      disabled: currentStageIndex >= totalStages - 1,
      primary: true,
    },
  ];

  return (
    <div
      className="solving-guide"
      style={{
        background: `linear-gradient(120deg, ${theme.background} 60%, ${theme.surface} 100%)`,
        color: theme.textPrimary,
        borderRadius: 4,
        boxShadow: `0 4px 32px ${theme.border}`,
        fontFamily: "system-ui, sans-serif",
        padding: "0",
        maxWidth: 480,
        minHeight: "80vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px 0 32px" }}>
        {/* 进度部分 + 手动切换按钮 */}
        <div
          style={{
            background: theme.surface,
            borderRadius: 14,
            boxShadow: `0 2px 12px ${theme.border}`,
            padding: "18px 22px 14px 22px",
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h3
            style={{
              color: theme.primary,
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            解魔方进度
          </h3>
          <div style={{ width: "100%", marginBottom: 8 }}>
            <div
              style={{
                background: theme.background,
                borderRadius: 8,
                height: 10,
                boxShadow: `0 1px 4px ${theme.border}`,
                width: "100%",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                  height: "100%",
                  borderRadius: 8,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
          <div
            style={{ color: theme.textSecondary, fontSize: 15, marginTop: 2 }}
          >
            当前步骤:{" "}
            <span style={{ color: theme.primary, fontWeight: 600 }}>
              {currentStageIndex + 1}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 12,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {navButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                disabled={btn.disabled}
                style={{
                  flex: 1,
                  background: btn.primary ? theme.primary : theme.surface,
                  color: btn.primary ? theme.background : theme.textSecondary,
                  border: `1px solid ${
                    btn.primary ? theme.primary : theme.border
                  }`,
                  borderRadius: 8,
                  padding: "8px 0",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: btn.disabled ? "not-allowed" : "pointer",
                  opacity: btn.disabled ? 0.5 : 1,
                  boxShadow: btn.primary
                    ? `0 1px 4px ${theme.primary}44`
                    : `0 1px 4px ${theme.border}`,
                  transition: "background 0.2s, color 0.2s, opacity 0.2s",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* 阶段信息 */}
        <div
          style={{
            background: theme.surface,
            borderRadius: 14,
            boxShadow: `0 2px 12px ${theme.border}`,
            padding: "18px 22px 14px 22px",
            marginBottom: 24,
          }}
        >
          <h4
            style={{
              color: theme.accent,
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            {stageName}
          </h4>
          <p
            style={{
              color: theme.textSecondary,
              fontSize: 15,
              textAlign: "left",
            }}
          >
            {stageDescription}
          </p>
        </div>

        {/* 提示部分 */}
        <div
          style={{
            background: theme.surface,
            borderRadius: 14,
            boxShadow: `0 2px 12px ${theme.border}`,
            padding: "18px 22px 14px 22px",
            marginBottom: 24,
          }}
        >
          <h4
            style={{
              color: theme.primary,
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 8,
            }}
          >
            操作提示
          </h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {hints.map((hint, index) => (
              <li
                key={index}
                style={{
                  color: theme.textSecondary,
                  fontSize: 15,
                  marginBottom: 4,
                  textAlign: "left",
                }}
              >
                {hint}
              </li>
            ))}
          </ul>
        </div>

        {/* 解法部分 */}
        <div
          style={{
            background: theme.surface,
            borderRadius: 14,
            boxShadow: `0 2px 12px ${theme.border}`,
            padding: "18px 22px 14px 22px",
            marginBottom: 32,
          }}
        >
          <h4
            style={{
              color: theme.accent,
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 8,
            }}
          >
            解法公式
          </h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {algorithms.map((algorithm, index) => (
              <li
                key={index}
                style={{
                  color: theme.textPrimary,
                  fontSize: 15,
                  marginBottom: 4,
                  fontFamily: "monospace",
                }}
              >
                {algorithm}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 底部悬浮按钮（容器内底部） */}
      <div
        style={{
          position: "sticky",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          background: `rgba(24,26,32,0.98)`,
          boxShadow: `0 -2px 16px ${theme.border}`,
          padding: "22px 0 22px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <button
          className="algorithm-btn"
          onClick={onAlgorithmClick}
          disabled={progress === 100}
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
            color: theme.background,
            border: `none`,
            borderRadius: 12,
            padding: "14px 48px",
            fontWeight: 800,
            fontSize: 20,
            cursor: progress === 100 ? "not-allowed" : "pointer",
            opacity: progress === 100 ? 0.5 : 1,
            boxShadow: `0 2px 16px ${theme.border}`,
            transition: "background 0.2s, color 0.2s, opacity 0.2s",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          执行下一步
        </button>
      </div>
    </div>
  );
}
