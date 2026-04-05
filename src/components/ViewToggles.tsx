import type { MapStyle, ViewMode } from "../types";

export function ViewToggles({ viewMode, setViewMode, mapStyle, setMapStyle }: {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  mapStyle: MapStyle;
  setMapStyle: (m: MapStyle) => void;
}) {
  const btnBase = "px-3 py-1 rounded-full text-xs transition-colors";
  const active = "bg-cyber-glow/20 text-cyber-glow font-medium";
  const inactive = "text-white/50 hover:text-white/80";

  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="cyber-panel flex items-center gap-1 px-2 py-1">
        <button onClick={() => setViewMode("scatter")} className={`${btnBase} ${viewMode === "scatter" ? active : inactive}`}>Scatter</button>
        <button onClick={() => setViewMode("heatmap")} className={`${btnBase} ${viewMode === "heatmap" ? active : inactive}`}>Heatmap</button>
      </div>
      <div className="cyber-panel flex items-center gap-1 px-2 py-1">
        {(["light", "dark", "voyager"] as MapStyle[]).map((m) => (
          <button key={m} onClick={() => setMapStyle(m)} className={`${btnBase} ${mapStyle === m ? "bg-cyber-blue/20 text-cyber-blue font-medium" : inactive}`}>
            {m === "voyager" ? "Voyager" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
