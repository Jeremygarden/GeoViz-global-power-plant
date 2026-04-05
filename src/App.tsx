import { useCallback, useEffect, useMemo, useState } from "react";
import { loadPlants } from "./lib/data/loadPlants";
import { filterPlants } from "./lib/data/filters";
import { computeMetrics } from "./lib/data/metrics";
import { useGeoVizState } from "./lib/state/useGeoVizState";
import { KpiRow } from "./components/KpiRow";
import { SidebarFilters } from "./components/SidebarFilters";
import { ViewToggles } from "./components/ViewToggles";
import { MapPanel } from "./components/MapPanel";
import { Tooltip } from "./components/Tooltip";
import type { PickingInfo } from "@deck.gl/core";
import type { Plant } from "./types";

export default function App() {
  const { filters, setFilters, viewMode, setViewMode, mapStyle, setMapStyle } = useGeoVizState();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [hover, setHover] = useState<{ plant: Plant | null; x: number; y: number }>({ plant: null, x: 0, y: 0 });
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");

  const handleHover = useCallback(
    (info: PickingInfo<Plant>) => setHover({ plant: info.object ?? null, x: info.x, y: info.y }),
    []
  );

  useEffect(() => {
    setLoadState("loading");
    loadPlants()
      .then((data) => {
        setPlants(data);
        const max = data.reduce((m, p) => Math.max(m, p.capacity_mw), 0) || 5000;
        setFilters((prev) => ({ ...prev, capacityRange: [0, max] }));
        setLoadState("idle");
      })
      .catch((error) => {
        console.error(error);
        setLoadState("error");
      });
  }, [setFilters]);

  const filtered = useMemo(() => filterPlants(plants, filters), [plants, filters]);
  const metrics = useMemo(() => computeMetrics(filtered), [filtered]);
  const energyOptions = useMemo(() => Array.from(new Set(plants.map((p) => p.primary_fuel))).sort(), [plants]);
  const countryOptions = useMemo(() => Array.from(new Set(plants.map((p) => p.country))).sort(), [plants]);

  return (
    <div className="relative min-h-screen p-6 space-y-6">
      {loadState === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          数据加载失败，请刷新页面重试
        </div>
      )}
      <KpiRow {...metrics} />
      <div className="flex items-start gap-6">
        <div className="w-64 shrink-0">
          <SidebarFilters filters={filters} onChange={setFilters} energyOptions={energyOptions} countryOptions={countryOptions} />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <ViewToggles viewMode={viewMode} setViewMode={setViewMode} mapStyle={mapStyle} setMapStyle={setMapStyle} />
          <MapPanel data={filtered} viewMode={viewMode} mapStyle={mapStyle} onHover={handleHover} />
        </div>
      </div>
      <Tooltip plant={hover.plant} x={hover.x} y={hover.y} />
      {loadState === "loading" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/40">
          <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow">
            <svg
              className="h-5 w-5 animate-spin text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            加载中...
          </div>
        </div>
      )}
    </div>
  );
}
