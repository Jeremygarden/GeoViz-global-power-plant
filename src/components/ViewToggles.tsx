import { MapStyle, ViewMode } from "../types";

export function ViewToggles({ viewMode, setViewMode, mapStyle, setMapStyle }: {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  mapStyle: MapStyle;
  setMapStyle: (m: MapStyle) => void;
}) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="cyber-panel px-3 py-1">
        <button onClick={() => setViewMode("scatter")} className={viewMode === "scatter" ? "text-cyber-glow" : "text-white/60"}>Scatter</button>
        <span className="mx-2 text-white/40">|</span>
        <button onClick={() => setViewMode("heatmap")} className={viewMode === "heatmap" ? "text-cyber-glow" : "text-white/60"}>Heatmap</button>
      </div>
      <div className="cyber-panel px-3 py-1">
        {(["light","dark","satellite"] as MapStyle[]).map((m) => (
          <button key={m} onClick={() => setMapStyle(m)} className={`mr-2 ${mapStyle === m ? "text-cyber-blue" : "text-white/60"}`}>{m}</button>
        ))}
      </div>
    </div>
  );
}
