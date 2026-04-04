import { useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Plant, ViewMode, MapStyle } from "../types";

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
      getPosition: (d: Plant) => [d.longitude, d.latitude],
      getRadius: (d: Plant) => Math.max(1000, d.capacity_mw * 40),
      getFillColor: [76, 195, 255, 160],
      pickable: true,
      onHover,
    });
    const heat = new HeatmapLayer<Plant>({
      id: "heat",
      data,
      getPosition: (d: Plant) => [d.longitude, d.latitude],
      getWeight: (d: Plant) => d.capacity_mw,
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
