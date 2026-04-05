# Design System — GeoViz Global Power Plant

## Product Context
- **What this is:** Interactive map dashboard visualizing ~35k global power plants
- **Who it's for:** Researchers, analysts, developers — people who want to explore energy infrastructure data
- **Space/industry:** Data visualization / GeoSpatial / Energy
- **Project type:** Web app / dashboard

## Aesthetic Direction
- **Direction:** Retro-Futuristic Terminal
- **Decoration level:** Intentional — subtle glow, grid texture, panel borders
- **Mood:** Like a radar screen in a 1980s operations center, rebuilt with modern WebGL. A tool that feels precise, not decorative. The map IS the product; UI is the instrument panel around it.

## Typography
- **KPI / Data numbers:** JetBrains Mono — tabular-nums, equal-width digits prevent layout shift when numbers update
- **UI / Labels / Body:** DM Sans — clean humanist sans, readable at small sizes, doesn't compete with the map
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  ```
- **Scale:**
  - KPI value: 1.5rem / font-bold / tabular-nums / tracking-tight
  - KPI label: 0.6875rem / uppercase / tracking-widest
  - Sidebar label: 0.6875rem / uppercase / tracking-widest
  - Body / tooltip: 0.75rem
  - Button: 0.75rem / font-medium

## Color
- **Approach:** Restrained with intentional accents
- **Background:** `#0b0f14` — deep navy-black
- **Surface (panels):** `#0a1119cc` — semi-transparent dark blue (existing cyber-panel)
- **Border:** `rgba(53,243,196,0.2)` — glow tint border
- **Primary Glow:** `#35f3c4` — cyan-green, active states, labels, selected items
- **Secondary Blue:** `#4cc3ff` — alternate active state, map style toggles
- **Accent Amber:** `#f3c435` — hover states, warning/fossil fuel energy types, third visual layer
- **Text primary:** `#ffffff`
- **Text muted:** `rgba(255,255,255,0.6)`
- **Text label:** `#35f3c4cc` (glow at 80%)
- **Semantic:** error `#ff5f5f`, success `#35f3c4`

## Spacing
- **Base unit:** 4px
- **Density:** Compact — data density first
- **Scale:** xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px)
- **Panel padding:** 16px (p-4)
- **Component gap:** 24px (gap-6)

## Layout
- **Approach:** Grid-disciplined
- **Structure:** Sidebar (256px fixed) left + map (flex-1) right
- **Map height:** `calc(100vh - 180px)` — fills viewport, map is the hero
- **KPI row:** fixed 3-column grid at top, always visible
- **Border radius:** panel=16px (rounded-xl), button/tag=9999px (rounded-full), input=8px (rounded-md)

## Motion
- **Approach:** Minimal-functional
- **Transitions:** `transition-colors duration-150` on interactive elements
- **KPI updates:** `transition-all duration-300` on value changes
- **No entrance animations, no scroll effects**

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-05 | JetBrains Mono for KPI numbers | Tabular-nums + terminal aesthetic, numbers don't shift width |
| 2026-04-05 | DM Sans replaces Inter | Less generic, still highly readable at small sizes |
| 2026-04-05 | Amber #f3c435 as 3rd accent | Pure cyan+blue palette was monochromatic; amber adds warmth and can map to fossil fuel types |
| 2026-04-05 | Sidebar on left | Dashboard convention; users expect filters before content |
| 2026-04-05 | Map fills viewport | Map is the product; fixed 520px felt like a widget, not a dashboard |
