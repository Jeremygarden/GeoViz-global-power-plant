import type { Plant } from "../../types";
import Papa from "papaparse";

const CSV_URL = "https://raw.githubusercontent.com/wri/global-power-plant-database/master/global_power_plant_database.csv";

type CsvRow = {
  country: string;
  name: string;
  capacity_mw: string;
  latitude: string;
  longitude: string;
  primary_fuel: string;
};

export async function loadPlants(): Promise<Plant[]> {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error("Failed to fetch dataset");
  const text = await res.text();

  const parsed = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return (parsed.data || [])
    .map((row) => ({
      name: row.name,
      country: row.country,
      primary_fuel: row.primary_fuel,
      capacity_mw: Number(row.capacity_mw || 0),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
    }))
    .filter((p) => !Number.isNaN(p.latitude) && !Number.isNaN(p.longitude));
}
