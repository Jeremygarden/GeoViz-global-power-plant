import { useEffect, useMemo, useState } from "react";
import { KpiRow } from "./components/KpiRow";
import { MapPanel } from "./components/MapPanel";
import { SidebarFilters } from "./components/SidebarFilters";
import { Tooltip } from "./components/Tooltip";
import { ViewToggles } from "./components/ViewToggles";
import { loadPlants } from "./lib/data/loadPlants";
import { filterPlants } from "./lib/data/filters";
import { computeMetrics } from "./lib/data/metrics";
import { useGeoVizState } from "./lib/state/useGeoVizState";
import { Plant } from "./types";

function App() {
  const { filters, setFilters, viewMode, setViewMode, mapStyle, setMapStyle } = useGeoVizState();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [hover, setHover] = useState<{ plant: Plant | null; x: number; y: number }>({
    plant: null,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let active = true;
    setStatus("loading");
    loadPlants()
      .then((data) => {
        if (!active) return;
        setPlants(data);
        setStatus("idle");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const energyOptions = useMemo(
    () => Array.from(new Set(plants.map((p) => p.primary_fuel))).sort(),
    [plants]
  );
  const countryOptions = useMemo(
    () => Array.from(new Set(plants.map((p) => p.country))).sort(),
    [plants]
  );

  const filteredPlants = useMemo(() => filterPlants(plants, filters), [plants, filters]);
  const metrics = useMemo(() => computeMetrics(filteredPlants), [filteredPlants]);

  return (
    <div className="min-h-screen cyber-grid">
      <Tooltip plant={hover.plant} x={hover.x} y={hover.y} />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyber-glow">GeoViz</div>
            <h1 className="text-3xl font-semibold">Global Power Plant Atlas</h1>
            <p className="mt-1 text-sm text-white/60">
              Explore generation capacity, fuel mix, and spatial density across the planet.
            </p>
          </div>
          <ViewToggles
            viewMode={viewMode}
            setViewMode={setViewMode}
            mapStyle={mapStyle}
            setMapStyle={setMapStyle}
          />
        </header>

        <KpiRow
          totalCapacity={metrics.totalCapacity}
          plantCount={metrics.plantCount}
          countryCount={metrics.countryCount}
        />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <SidebarFilters
            filters={filters}
            onChange={setFilters}
            energyOptions={energyOptions}
            countryOptions={countryOptions}
          />
          <div className="space-y-4">
            <div className="cyber-panel flex items-center justify-between px-4 py-3 text-xs text-white/60">
              <span>
                Showing <span className="text-white">{filteredPlants.length.toLocaleString()}</span> plants
              </span>
              {status === "loading" && <span className="text-cyber-glow">Loading dataset…</span>}
              {status === "error" && <span className="text-red-300">Failed to load dataset.</span>}
            </div>
            <MapPanel
              data={filteredPlants}
              viewMode={viewMode}
              mapStyle={mapStyle}
              onHover={(info) =>
                setHover({
                  plant: (info?.object as Plant | null) ?? null,
                  x: info?.x ?? 0,
                  y: info?.y ?? 0,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
