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
  setStageIndex?: (index: number) => void;
}

export function SolvingGuide({
  currentStageIndex,
  progress,
  hints,
  onAlgorithmClick,
  stageName,
  stageDescription,
  algorithms,
  setStageIndex,
}: SolvingGuideProps) {
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
        {/* 进度部分 */}
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
              lineHeight: 1.6,
              marginBottom: 0,
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
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.5 }}>
            {hints.map((hint, index) => (
              <li
                key={index}
                style={{
                  color: theme.textSecondary,
                  fontSize: 15,
                  marginBottom: 8,
                  textAlign: "left",
                  lineHeight: 1.6,
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
        {/* Temporary stage navigation for testing */}
        {setStageIndex && (
          <div style={{ 
            display: "flex", 
            gap: 8, 
            marginBottom: 16,
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            {["白十字", "白角", "中间层", "黄十字", "黄棱", "黄角位", "黄角向"].map((name, index) => (
              <button
                key={index}
                onClick={() => setStageIndex(index)}
                style={{
                  background: currentStageIndex === index ? theme.primary : theme.surface,
                  color: currentStageIndex === index ? theme.background : theme.textSecondary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: currentStageIndex === index ? 600 : 400,
                }}
              >
                {index + 1}. {name}
              </button>
            ))}
          </div>
        )}
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
