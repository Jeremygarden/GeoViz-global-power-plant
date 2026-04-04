import { Plant } from "../../types";

export function computeMetrics(plants: Plant[]) {
  const totalCapacity = plants.reduce((sum, p) => sum + p.capacity_mw, 0);
  const plantCount = plants.length;
  const countryCount = new Set(plants.map((p) => p.country)).size;
  return { totalCapacity, plantCount, countryCount };
}
