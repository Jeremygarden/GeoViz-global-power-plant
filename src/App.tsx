import { useEffect, useMemo, useState } from "react";
import { loadPlants } from "./lib/data/loadPlants";
import { filterPlants } from "./lib/data/filters";
import { computeMetrics } from "./lib/data/metrics";
import { useGeoVizState } from "./lib/state/useGeoVizState";
import { KpiRow } from "./components/KpiRow";
import { SidebarFilters } from "./components/SidebarFilters";
import { ViewToggles } from "./components/ViewToggles";
import { MapPanel } from "./components/MapPanel";
import { Tooltip } from "./components/Tooltip";
import type { Plant } from "./types";

export default function App() {
  const { filters, setFilters, viewMode, setViewMode, mapStyle, setMapStyle } = useGeoVizState();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [hover, setHover] = useState<{ plant: Plant | null; x: number; y: number }>({ plant: null, x: 0, y: 0 });

  useEffect(() => {
    loadPlants().then(setPlants).catch(console.error);
  }, []);

  const filtered = useMemo(() => filterPlants(plants, filters), [plants, filters]);
  const metrics = useMemo(() => computeMetrics(filtered), [filtered]);
  const energyOptions = useMemo(() => Array.from(new Set(plants.map((p) => p.primary_fuel))).sort(), [plants]);
  const countryOptions = useMemo(() => Array.from(new Set(plants.map((p) => p.country))).sort(), [plants]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <KpiRow {...metrics} />
      <div className="flex items-start gap-6">
        <div className="flex-1 space-y-3">
          <ViewToggles viewMode={viewMode} setViewMode={setViewMode} mapStyle={mapStyle} setMapStyle={setMapStyle} />
          <MapPanel
            data={filtered}
            viewMode={viewMode}
            mapStyle={mapStyle}
            onHover={(info) => setHover({ plant: info.object ?? null, x: info.x, y: info.y })}
          />
        </div>
        <div className="w-64">
          <SidebarFilters filters={filters} onChange={setFilters} energyOptions={energyOptions} countryOptions={countryOptions} />
        </div>
      </div>
      <Tooltip plant={hover.plant} x={hover.x} y={hover.y} />
    </div>
  );
}
