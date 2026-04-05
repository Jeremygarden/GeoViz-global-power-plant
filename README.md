# GeoViz — Global Power Plant Dashboard

An interactive map dashboard visualizing the [Global Power Plant Database](https://github.com/wri/global-power-plant-database) — ~35,000 power plants worldwide, filterable by energy type, country, and capacity.

**Live:** [Deployed on Vercel](https://github.com/Jeremygarden/GeoViz-global-power-plant)

---

## Features

- **Scatterplot / Heatmap toggle** — switch between point-level detail and density view
- **Map styles** — Light, Dark, Voyager
- **Live KPI row** — total capacity (MW), plant count, country count, all reactive to filters
- **Sidebar filters** — energy type multi-select, country search + select, capacity range slider
- **Hover tooltip** — plant name, country, fuel type, capacity on hover
- **Loading / error states** — graceful handling of CSV fetch

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + TypeScript |
| Map / WebGL | deck.gl 9 + MapLibre GL |
| Data viz | D3 (scales, color mapping) |
| Styling | TailwindCSS 3 |
| Build | Vite 8 |
| Deploy | Vercel |

## Data Source

[Global Power Plant Database](https://github.com/wri/global-power-plant-database) by World Resources Institute — open data, CC BY 4.0.

Loaded client-side at runtime from the WRI GitHub raw CSV (~35k rows, ~4MB).

## Project Structure

```
src/
├── App.tsx                    # Root layout, data loading, state wiring
├── types.ts                   # Plant, Filters, ViewMode, MapStyle types
├── components/
│   ├── KpiRow.tsx             # Top KPI cards (capacity / count / countries)
│   ├── MapPanel.tsx           # deck.gl DeckGL + MapLibre map
│   ├── SidebarFilters.tsx     # Energy type, country search, capacity slider
│   ├── ViewToggles.tsx        # Scatter/Heatmap + map style toggles
│   └── Tooltip.tsx            # Hover tooltip
└── lib/
    ├── data/
    │   ├── loadPlants.ts      # CSV fetch + PapaParse
    │   ├── filters.ts         # filterPlants() — pure filter pipeline
    │   └── metrics.ts         # computeMetrics() — KPI aggregation
    └── state/
        └── useGeoVizState.ts  # Centralized filter/view/style state
```

## Getting Started

```bash
npm install
npm run dev
```

```bash
npm run build       # production build
npm run test:run    # run tests once
npm run test        # watch mode
```

## Design

Cyber / Retro-Futuristic Terminal aesthetic. Dark base `#0b0f14`, primary glow `#35f3c4`, secondary blue `#4cc3ff`.

See `DESIGN.md` for the full design system (font choices, color tokens, spacing, motion).

## License

MIT
