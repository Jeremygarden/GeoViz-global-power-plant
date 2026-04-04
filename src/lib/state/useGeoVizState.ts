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

  const state = useMemo(
    () => ({
      filters,
      setFilters,
      viewMode,
      setViewMode,
      mapStyle,
      setMapStyle,
    }),
    [filters, viewMode, mapStyle]
  );

  return state;
}
