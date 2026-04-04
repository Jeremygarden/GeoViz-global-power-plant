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
