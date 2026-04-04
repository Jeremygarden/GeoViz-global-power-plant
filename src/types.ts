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
