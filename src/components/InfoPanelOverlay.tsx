import React, { useState } from "react";
import theme from "../styles/theme";

// CubeInfoPanel 组件内容合并
const CubeInfoPanel: React.FC = () => {
  return (
    <div
      style={{
        width: 260,
        minWidth: 220,
        maxWidth: 320,
        height: "100%",
        color: theme.textPrimary,
        fontFamily: "system-ui, sans-serif",
        background: theme.surface,
        padding: "32px 24px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 12,
        boxShadow: `0 2px 16px ${theme.border}`,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 17,
          marginBottom: 16,
          letterSpacing: 1,
        }}
      >
        魔方方块说明
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <span
          style={{
            width: 20,
            height: 20,
            background: theme.primary,
            borderRadius: "50%",
            marginRight: 12,
            border: `2px solid ${theme.textPrimary}`,
            display: "inline-block",
          }}
        />
        <span style={{ fontWeight: 500, fontSize: 15 }}>角块：3色贴纸</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <span
          style={{
            width: 20,
            height: 20,
            background: theme.accent,
            borderRadius: "50%",
            marginRight: 12,
            border: `2px solid ${theme.textPrimary}`,
            display: "inline-block",
          }}
        />
        <span style={{ fontWeight: 500, fontSize: 15 }}>棱块：2色贴纸</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            width: 20,
            height: 20,
            background: "#FFD600", // 主题可加 yellow
            borderRadius: "50%",
            marginRight: 12,
            border: `2px solid ${theme.textPrimary}`,
            display: "inline-block",
          }}
        />
        <span style={{ fontWeight: 500, fontSize: 15 }}>中心块：1色贴纸</span>
      </div>
      <div
        style={{
          margin: "18px 0 8px 0",
          borderTop: `1px solid ${theme.border}`,
          paddingTop: 12,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
          旋转方向说明
        </div>
        <table
          style={{
            width: "100%",
            fontSize: 14,
            borderCollapse: "collapse",
            color: theme.textPrimary,
          }}
        >
          <thead>
            <tr style={{ color: theme.textSecondary }}>
              <th style={{ textAlign: "left", paddingBottom: 4 }}>面</th>
              <th style={{ textAlign: "center", paddingBottom: 4 }}>顺时针</th>
              <th style={{ textAlign: "center", paddingBottom: 4 }}>逆时针</th>
            </tr>
          </thead>
          <tbody>
            {[
              { face: "R", name: "右", color: "#00B7FF" },
              { face: "U", name: "上", color: "#00FFD0" },
              { face: "F", name: "前", color: "#FFD600" },
            ].map(({ face, name, color }) => (
              <tr key={face}>
                <td style={{ color, fontWeight: 600 }}>
                  {face}（{name}）
                </td>
                <td style={{ textAlign: "center" }}>
                  <svg
                    width="24"
                    height="24"
                    style={{ verticalAlign: "middle" }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={theme.primary}
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M12 5 A7 7 0 0 1 19 12"
                      stroke={theme.primary}
                      strokeWidth="2"
                      fill="none"
                    />
                    <polygon points="19,12 16,11 17,14" fill={theme.primary} />
                  </svg>
                  <span style={{ marginLeft: 4 }}>R</span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <svg
                    width="24"
                    height="24"
                    style={{ verticalAlign: "middle" }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={theme.accent}
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M19 12 A7 7 0 0 1 12 5"
                      stroke={theme.accent}
                      strokeWidth="2"
                      fill="none"
                    />
                    <polygon points="12,5 13,8 10,7" fill={theme.accent} />
                  </svg>
                  <span style={{ marginLeft: 4 }}>{face}'</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 8, fontSize: 13, color: theme.textSecondary }}>
          <span style={{ fontWeight: 600 }}>示例：</span> R = 右面顺时针，R' =
          右面逆时针
        </div>
      </div>
    </div>
  );
};

const InfoPanelOverlay: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <>
      {/* 悬浮拓展按钮 */}
      <button
        onClick={() => setShowInfo((v) => !v)}
        style={{
          position: "absolute",
          top: 24,
          right: 0,
          zIndex: 1100,
          background: showInfo ? theme.primary : theme.surface,
          color: theme.textPrimary,
          border: "none",
          borderRadius: "50%",
          width: 48,
          height: 48,
          boxShadow: `0 2px 8px ${theme.border}`,
          cursor: "pointer",
          fontSize: 22,
          fontWeight: 700,
          transition: "background 0.2s",
        }}
        title={showInfo ? "收起说明" : "展开说明"}
      >
        {showInfo ? "×" : "?"}
      </button>
      {/* 半透明说明弹窗，浮在魔方上方 */}
      {showInfo && (
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 0,
            zIndex: 1099,
            background: "rgba(35,38,47,0.92)", // theme.surface + 透明
            borderRadius: 16,
            boxShadow: `0 8px 32px ${theme.border}`,
            color: theme.textPrimary,
            padding: "28px 22px",
            minWidth: 240,
            maxWidth: 360,
            fontFamily: "system-ui, sans-serif",
            pointerEvents: "auto",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {/* 只渲染内容，不再设置额外背景 */}
          <div style={{ background: "none", width: "100%" }}>
            <CubeInfoPanel />
          </div>
        </div>
      )}
    </>
  );
};

export default InfoPanelOverlay;
