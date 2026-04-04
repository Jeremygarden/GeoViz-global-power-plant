# GeoViz / DataMap — Design Spec (v1)

Date: 2026-04-04

## 1) Goal & Scope
Deliver a 2–3 day interactive map dashboard that visualizes the **Global Power Plant Database** using **deck.gl** + **MapLibre GL**, with front-end filtering and KPI summaries. No backend, no auth, no complex routing.

**In scope**
- Map base layer (Light/Dark/Satellite)
- Scatterplot + Heatmap (toggle)
- Sidebar filters (Energy type, Country, Capacity range)
- Hover tooltip with plant details
- KPI cards (Total capacity, Plant count, Country count)

**Out of scope**
- User accounts, server DB, complex routing

## 2) Tech Stack
- React 18 + TypeScript
- Vite
- deck.gl (WebGL layers)
- MapLibre GL (basemap; no token)
- D3 (scales + data aggregation)
- TailwindCSS (UI)

## 3) Data Model
Source: **Global Power Plant Database** (CSV/GeoJSON). Preprocess on client:

**Fields used**
- `name`
- `latitude`, `longitude`
- `country`
- `primary_fuel`
- `capacity_mw`

**Derived**
- `capacity_bucket` (for scale/legend)
- `energy_type` group for filtering

## 4) Data Flow & State
**State**
- `filters`: { energyTypes[], countries[], capacityRange } 
- `viewMode`: scatter | heatmap
- `mapStyle`: light | dark | satellite

**Pipeline**
1. Load & parse dataset (CSV → objects)
2. Apply filters (energy/country/capacity)
3. Update KPI metrics from filtered result
4. Provide filtered data to deck.gl layers

## 5) Map & Layers
**Layers**
- `ScatterplotLayer` for individual plants
- `HeatmapLayer` for density
- (optional) `AggregationLayer` for clustered point sizes

**Interactions**
- Hover tooltip: plant name, country, fuel, capacity
- Toggle between scatter/heatmap

## 6) UI Layout
- **Top**: KPI cards
- **Left panel**: Filters (energy type, country, capacity)
- **Main**: Map canvas + view mode & basemap toggle

## 7) Style & UX
- **Cyber‑tech** vibe (neon teal/blue accents, grid background, soft glow, glassy panels)
- Dark‑leaning UI with high‑contrast KPI cards and subtle motion cues
- Map canvas dominates; sidebar narrow on the right
- Responsive layout for laptop/mobile

## 8) Error Handling
- Fallback UI if dataset load fails
- Empty state if no data matches filters

## 9) Testing & Verification
- Basic smoke test: app loads, layers render
- Filter interactions update KPI + map
- Hover tooltip correctness

---

## ✅ Spec Review Checklist
- No placeholders or TBDs
- Architecture matches UI + data flow
- Scope is 2–3 days, no backend
- Ambiguities resolved (MapLibre, dataset, KPI)