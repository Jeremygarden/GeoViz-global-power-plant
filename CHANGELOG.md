# Changelog

All notable changes to GeoViz are documented here.

---

## [Unreleased]

### Planned
- DESIGN.md — full design system document
- JetBrains Mono for KPI numbers, DM Sans for UI
- Amber `#f3c435` accent token
- Map height: fill viewport (`calc(100vh - 180px)`)
- Double-ended capacity range slider

---

## [0.2.0] — 2026-04-05

### Design
- Sidebar moved from right to left — matches dashboard convention
- KPI numbers: `font-bold tabular-nums tracking-tight` for stable, readable data
- KPI labels: `uppercase tracking-widest` for clear dashboard hierarchy
- ViewToggles: active state now has pill background (`bg-cyber-glow/20`) instead of text-color-only
- Capacity slider: shows live range label `0 – X MW`
- Country filter: search input added — no more scrolling through 200 countries

### Bug Fixes
- Fixed `Math.max(...spread)` crash — `RangeError` on 35k items replaced with `reduce`
- Added loading and error states — users now see a spinner and retry message instead of a blank map
- `useCallback` on `onHover` — prevents deck.gl layers rebuilding on every render
- Removed misleading `useMemo` in `useGeoVizState` — state hook returns plain object
- `satellite` map style renamed to `voyager` — it was always Carto Voyager, not satellite imagery

### Tests
- `filters.test.ts`: added country filter, empty energyTypes (pass-all), capacity boundary cases
- `metrics.test.ts`: added empty array input, zero-capacity plants
- `loadPlants.test.ts` (new): fetch failure path, NaN coordinate filtering

### Project
- `package.json`: renamed from `tmp-vite` to `geoviz-global-power-plant`
- Added `test` and `test:run` scripts
- Removed `docs/` directory, added `.worktrees/` to `.gitignore`

---

## [0.1.0] — 2026-04-04

### Initial Release
- React 18 + TypeScript + deck.gl + MapLibre + Vite scaffold
- ScatterplotLayer and HeatmapLayer with toggle
- Filter pipeline: energy type, country, capacity range
- KPI row: total capacity, plant count, country count
- Hover tooltip: plant name, country, fuel type, capacity
- Centralized state via `useGeoVizState`
- Deployed to Vercel
