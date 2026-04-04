# GeoViz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cyber‑tech styled GeoViz dashboard that visualizes Global Power Plant Database with MapLibre + deck.gl, filters, KPI cards, tooltips, and view/basemap toggles.

**Architecture:** A Vite + React app with a single page layout. Data is loaded once, normalized in a data module, filtered by a pure pipeline, and shared across KPI cards and deck.gl layers. UI state (filters, view mode, basemap) is centralized in a single hook.

**Tech Stack:** React 18, TypeScript, Vite, deck.gl, MapLibre GL, D3 (scales), TailwindCSS, Vitest.

---

## File Structure

- Create: `src/main.tsx` — app bootstrap
- Create: `src/App.tsx` — top-level layout composition
- Create: `src/components/KpiRow.tsx` — KPI cards
- Create: `src/components/MapPanel.tsx` — map canvas + deck.gl layers
- Create: `src/components/SidebarFilters.tsx` — filters UI
- Create: `src/components/ViewToggles.tsx` — view + basemap toggles
- Create: `src/components/Tooltip.tsx` — hover tooltip
- Create: `src/lib/data/loadPlants.ts` — fetch + parse CSV
- Create: `src/lib/data/filters.ts` — pure filter pipeline
- Create: `src/lib/data/metrics.ts` — KPI aggregation
- Create: `src/lib/data/scales.ts` — D3 scales (size/color)
- Create: `src/lib/state/useGeoVizState.ts` — centralized UI state
- Create: `src/styles/index.css` — Tailwind + cyber‑tech styles
- Create: `src/types.ts` — shared types
- Create: `tests/filters.test.ts` — filter pipeline tests
- Create: `tests/metrics.test.ts` — KPI aggregation tests

---

### Task 1: Scaffold Vite + React + Tailwind + Vitest

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`, `src/styles/index.css`

- [ ] **Step 1: Create Vite app**

Run:
```bash
cd /home/azureuser/.openclaw/workspace-coder/geoviz-global-power-plant
npm create vite@latest . -- --template react-ts
```
Expected: Vite scaffold created.

- [ ] **Step 2: Install deps**

Run:
```bash
npm install
npm install maplibre-gl deck.gl @deck.gl/core @deck.gl/layers @deck.gl/react d3
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Init Tailwind**

Run:
```bash
npx tailwindcss init -p
```

- [ ] **Step 4: Configure Tailwind content**

Edit `tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          base: "#0b0f14",
          glow: "#35f3c4",
          blue: "#4cc3ff",
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Add base styles**

Edit `src/styles/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }
body {
  @apply bg-[#0b0f14] text-white;
  font-family: Inter, ui-sans-serif, system-ui;
}

.cyber-panel {
  @apply rounded-2xl border border-[#2ef3c433] bg-[#0a1119cc] shadow-[0_0_30px_rgba(53,243,196,0.15)];
}

.cyber-grid {
  background-image: linear-gradient(rgba(53,243,196,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(76,195,255,0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

- [ ] **Step 6: Wire CSS in main**

Edit `src/main.tsx`:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 7: Smoke test**

Run:
```bash
npm run dev
```
Expected: Vite dev server runs, page loads.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "chore: scaffold vite react tailwind"
```

---

### Task 2: Add types + dataset loader

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/data/loadPlants.ts`

- [ ] **Step 1: Write types**

Create `src/types.ts`:
```ts
export type Plant = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  primary_fuel: string;
  capacity_mw: number;
};

export type Filters = {
  energyTypes: string[];
  countries: string[];
  capacityRange: [number, number];
};

export type ViewMode = "scatter" | "heatmap";
export type MapStyle = "light" | "dark" | "satellite";
```

- [ ] **Step 2: Write loader**

Create `src/lib/data/loadPlants.ts`:
```ts
import { Plant } from "../../types";

const CSV_URL = "https://raw.githubusercontent.com/wri/global-power-plant-database/master/global_power_plant_database.csv";

export async function loadPlants(): Promise<Plant[]> {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error("Failed to fetch dataset");
  const text = await res.text();
  const rows = text.split("\n").slice(1); // skip header

  return rows
    .map((row) => row.split(","))
    .filter((cols) => cols.length > 10)
    .map((cols) => ({
      name: cols[1],
      country: cols[0],
      primary_fuel: cols[7],
      capacity_mw: Number(cols[4] || 0),
      latitude: Number(cols[5]),
      longitude: Number(cols[6]),
    }))
    .filter((p) => !Number.isNaN(p.latitude) && !Number.isNaN(p.longitude));
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types.ts src/lib/data/loadPlants.ts
git commit -m "feat: add plant types and loader"
```

---

### Task 3: Filtering + KPI aggregation (TDD)

**Files:**
- Create: `src/lib/data/filters.ts`
- Create: `src/lib/data/metrics.ts`
- Create: `tests/filters.test.ts`
- Create: `tests/metrics.test.ts`

- [ ] **Step 1: Write failing test for filters**

Create `tests/filters.test.ts`:
```ts
import { filterPlants } from "../src/lib/data/filters";
import { Plant } from "../src/types";

const sample: Plant[] = [
  { name: "A", latitude: 1, longitude: 1, country: "US", primary_fuel: "Coal", capacity_mw: 100 },
  { name: "B", latitude: 2, longitude: 2, country: "CN", primary_fuel: "Solar", capacity_mw: 20 },
];

test("filters by energy and capacity", () => {
  const out = filterPlants(sample, {
    energyTypes: ["Coal"],
    countries: [],
    capacityRange: [50, 200],
  });
  expect(out.length).toBe(1);
  expect(out[0].name).toBe("A");
});
```

- [ ] **Step 2: Run test (expect fail)**

Run:
```bash
npx vitest run tests/filters.test.ts
```
Expected: FAIL (filterPlants not defined).

- [ ] **Step 3: Implement filter pipeline**

Create `src/lib/data/filters.ts`:
```ts
import { Filters, Plant } from "../../types";

export function filterPlants(plants: Plant[], filters: Filters): Plant[] {
  const [minCap, maxCap] = filters.capacityRange;
  return plants.filter((p) => {
    const okType = filters.energyTypes.length === 0 || filters.energyTypes.includes(p.primary_fuel);
    const okCountry = filters.countries.length === 0 || filters.countries.includes(p.country);
    const okCap = p.capacity_mw >= minCap && p.capacity_mw <= maxCap;
    return okType && okCountry && okCap;
  });
}
```

- [ ] **Step 4: Run test (expect pass)**

Run:
```bash
npx vitest run tests/filters.test.ts
```
Expected: PASS

- [ ] **Step 5: Write failing test for KPI metrics**

Create `tests/metrics.test.ts`:
```ts
import { computeMetrics } from "../src/lib/data/metrics";
import { Plant } from "../src/types";

const sample: Plant[] = [
  { name: "A", latitude: 1, longitude: 1, country: "US", primary_fuel: "Coal", capacity_mw: 100 },
  { name: "B", latitude: 2, longitude: 2, country: "US", primary_fuel: "Solar", capacity_mw: 20 },
];

test("metrics aggregates correctly", () => {
  const out = computeMetrics(sample);
  expect(out.totalCapacity).toBe(120);
  expect(out.plantCount).toBe(2);
  expect(out.countryCount).toBe(1);
});
```

- [ ] **Step 6: Run test (expect fail)**

Run:
```bash
npx vitest run tests/metrics.test.ts
```
Expected: FAIL (computeMetrics not defined).

- [ ] **Step 7: Implement metrics**

Create `src/lib/data/metrics.ts`:
```ts
import { Plant } from "../../types";

export function computeMetrics(plants: Plant[]) {
  const totalCapacity = plants.reduce((sum, p) => sum + p.capacity_mw, 0);
  const plantCount = plants.length;
  const countryCount = new Set(plants.map((p) => p.country)).size;
  return { totalCapacity, plantCount, countryCount };
}
```

- [ ] **Step 8: Run test (expect pass)**

Run:
```bash
npx vitest run tests/metrics.test.ts
```
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/lib/data/filters.ts src/lib/data/metrics.ts tests/filters.test.ts tests/metrics.test.ts
git commit -m "feat: add filter pipeline and KPI metrics"
```

---

### Task 4: UI State Hook

**Files:**
- Create: `src/lib/state/useGeoVizState.ts`

- [ ] **Step 1: Implement hook**

Create `src/lib/state/useGeoVizState.ts`:
```ts
import { useMemo, useState } from "react";
import { Filters, MapStyle, ViewMode } from "../../types";

export function useGeoVizState() {
  const [filters, setFilters] = useState<Filters>({
    energyTypes: [],
    countries: [],
    capacityRange: [0, 5000],
  });
  const [viewMode, setViewMode] = useState<ViewMode>("scatter");
  const [mapStyle, setMapStyle] = useState<MapStyle>("dark");

  const state = useMemo(() => ({
    filters,
    setFilters,
    viewMode,
    setViewMode,
    mapStyle,
    setMapStyle,
  }), [filters, viewMode, mapStyle]);

  return state;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/state/useGeoVizState.ts
git commit -m "feat: add centralized UI state"
```

---

### Task 5: Map Panel + Layers

**Files:**
- Create: `src/components/MapPanel.tsx`
- Create: `src/components/Tooltip.tsx`

- [ ] **Step 1: Map panel scaffold**

Create `src/components/MapPanel.tsx`:
```tsx
import { useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer, HeatmapLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Plant, ViewMode, MapStyle } from "../types";

const MAP_STYLES: Record<MapStyle, string> = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
};

export function MapPanel({ data, viewMode, mapStyle, onHover }: {
  data: Plant[];
  viewMode: ViewMode;
  mapStyle: MapStyle;
  onHover: (info: any) => void;
}) {
  const layers = useMemo(() => {
    const scatter = new ScatterplotLayer<Plant>({
      id: "scatter",
      data,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => Math.max(1000, d.capacity_mw * 40),
      getFillColor: [76, 195, 255, 160],
      pickable: true,
      onHover,
    });
    const heat = new HeatmapLayer<Plant>({
      id: "heat",
      data,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.capacity_mw,
    });
    return viewMode === "scatter" ? [scatter] : [heat];
  }, [data, viewMode, onHover]);

  return (
    <div className="cyber-panel h-[520px] w-full">
      <DeckGL
        initialViewState={{ longitude: 0, latitude: 20, zoom: 1.3 }}
        controller
        layers={layers}
      >
        <Map reuseMaps mapStyle={MAP_STYLES[mapStyle]} />
      </DeckGL>
    </div>
  );
}
```

- [ ] **Step 2: Tooltip component**

Create `src/components/Tooltip.tsx`:
```tsx
import { Plant } from "../types";

export function Tooltip({ plant, x, y }: { plant: Plant | null; x: number; y: number }) {
  if (!plant) return null;
  return (
    <div className="fixed z-50 rounded-xl border border-cyber-glow/40 bg-[#0b1118]/90 p-3 text-xs text-white shadow-xl" style={{ left: x + 12, top: y + 12 }}>
      <div className="font-semibold">{plant.name}</div>
      <div>{plant.country} · {plant.primary_fuel}</div>
      <div>{plant.capacity_mw} MW</div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MapPanel.tsx src/components/Tooltip.tsx
git commit -m "feat: add map panel and tooltip"
```

---

### Task 6: KPI Row + Filters + Toggles

**Files:**
- Create: `src/components/KpiRow.tsx`
- Create: `src/components/SidebarFilters.tsx`
- Create: `src/components/ViewToggles.tsx`

- [ ] **Step 1: KPI Row**

Create `src/components/KpiRow.tsx`:
```tsx
export function KpiRow({ totalCapacity, plantCount, countryCount }: { totalCapacity: number; plantCount: number; countryCount: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[
        { label: "Total Capacity", value: `${Math.round(totalCapacity).toLocaleString()} MW` },
        { label: "Plant Count", value: plantCount.toLocaleString() },
        { label: "Countries", value: countryCount.toLocaleString() },
      ].map((k) => (
        <div key={k.label} className="cyber-panel p-4">
          <div className="text-xs text-cyber-glow">{k.label}</div>
          <div className="mt-2 text-2xl font-semibold">{k.value}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Sidebar filters**

Create `src/components/SidebarFilters.tsx`:
```tsx
import { Filters } from "../types";

export function SidebarFilters({ filters, onChange, energyOptions, countryOptions }: {
  filters: Filters;
  onChange: (f: Filters) => void;
  energyOptions: string[];
  countryOptions: string[];
}) {
  const toggle = (key: "energyTypes" | "countries", value: string) => {
    const list = filters[key];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="cyber-panel p-4 space-y-4">
      <div>
        <div className="text-xs text-cyber-glow">Energy Type</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {energyOptions.map((e) => (
            <button key={e} onClick={() => toggle("energyTypes", e)}
              className={`rounded-full px-3 py-1 text-xs border ${filters.energyTypes.includes(e) ? "border-cyber-glow text-cyber-glow" : "border-white/10 text-white/70"}`}>
              {e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-cyber-glow">Capacity (MW)</div>
        <input
          type="range"
          min={0}
          max={5000}
          value={filters.capacityRange[1]}
          onChange={(e) => onChange({ ...filters, capacityRange: [0, Number(e.target.value)] })}
          className="w-full"
        />
      </div>
      <div>
        <div className="text-xs text-cyber-glow">Country</div>
        <div className="mt-2 max-h-40 overflow-auto space-y-1">
          {countryOptions.map((c) => (
            <button key={c} onClick={() => toggle("countries", c)} className={`block w-full text-left text-xs ${filters.countries.includes(c) ? "text-cyber-blue" : "text-white/70"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: View toggles**

Create `src/components/ViewToggles.tsx`:
```tsx
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
```

- [ ] **Step 4: Commit**

```bash
git add src/components/KpiRow.tsx src/components/SidebarFilters.tsx src/components/ViewToggles.tsx
git commit -m "feat: add KPI row, filters, and view toggles"
```

---

### Task 7: Compose App

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Implement App layout**

Edit `src/App.tsx`:
```tsx
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
import { Plant } from "./types";

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
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: compose GeoViz dashboard"
```

---

### Task 8: QA + Build

- [ ] **Step 1: Run tests**

```bash
npx vitest run
```
Expected: PASS

- [ ] **Step 2: Build**

```bash
npm run build
```
Expected: Vite build success

- [ ] **Step 3: Commit QA results**

```bash
git status
```
Expected: clean

---

## Self‑Review Checklist
- Spec coverage: MapLibre basemap, scatter/heatmap toggle, filters, KPI, tooltip ✅
- No placeholders ✅
- Types and signatures consistent ✅

---

## Execution Options
Plan complete and saved to `docs/superpowers/plans/2026-04-04-geoviz-implementation-plan.md`.

Two execution options:
1. **Subagent‑Driven (recommended)** — use superpowers:subagent-driven-development
2. **Inline Execution** — use superpowers:executing-plans

Which approach?