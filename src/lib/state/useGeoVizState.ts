import { useState } from "react";
import type { Filters, MapStyle, ViewMode } from "../../types";

export function useGeoVizState() {
  const [filters, setFilters] = useState<Filters>({
    energyTypes: [],
    countries: [],
    capacityRange: [0, 5000],
  });
  const [viewMode, setViewMode] = useState<ViewMode>("scatter");
  const [mapStyle, setMapStyle] = useState<MapStyle>("dark");

  return { filters, setFilters, viewMode, setViewMode, mapStyle, setMapStyle };
}
