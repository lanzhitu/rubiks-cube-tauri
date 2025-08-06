interface DebugPanelProps {
  cubeState: string;
  backendState: string;
  syncResult: string;
  onSync: () => void;
  isAnimating: boolean;
}

export function DebugPanel({
  cubeState,
  backendState,
  syncResult,
  onSync,
  isAnimating,
}: DebugPanelProps) {
  return (
    <div
      style={{
        marginTop: 0,
        padding: 8,
        background: "#000000",
        borderRadius: 4,
      }}
    >
      <strong>调试：CubeState</strong>
      <div>
        <div
          style={{
            wordBreak: "break-all",
            fontFamily: "monospace",
            fontSize: 14,
            background: "#111",
            padding: 4,
            borderRadius: 2,
            marginBottom: 12,
            maxHeight: 80,
            overflowY: "auto",
          }}
        >
          前端：{cubeState}
        </div>
        <div
          style={{
            wordBreak: "break-all",
            fontFamily: "monospace",
            fontSize: 14,
            background: "#111",
            padding: 4,
            borderRadius: 2,
            maxHeight: 80,
            overflowY: "auto",
          }}
        >
          后端：{backendState}
        </div>
      </div>
      {syncResult === "match" && (
        <div style={{ marginTop: 8, color: "#0f0", fontWeight: "bold" }}>
          ✅ 状态一致
        </div>
      )}
      {syncResult === "mismatch" && (
        <div style={{ marginTop: 8, color: "#f00", fontWeight: "bold" }}>
          ❌ 状态不一致
        </div>
      )}
      <button onClick={onSync} disabled={isAnimating} style={{ marginTop: 8 }}>
        检测前后端状态同步
      </button>
    </div>
  );
}
