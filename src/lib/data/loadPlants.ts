import { Plant } from "../../types";

const CSV_URL = "https://raw.githubusercontent.com/wri/global-power-plant-database/master/global_power_plant_database.csv";

export async function loadPlants(): Promise<Plant[]> {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error("Failed to fetch dataset");
  const text = await res.text();
  const rows = text.split("\n").slice(1); // skip header

  return rows
    .map((row) => row.split(","))
    .filter((cols) => cols.length > 10)
    .map((cols) => ({
      name: cols[1],
      country: cols[0],
      primary_fuel: cols[7],
      capacity_mw: Number(cols[4] || 0),
      latitude: Number(cols[5]),
      longitude: Number(cols[6]),
    }))
    .filter((p) => !Number.isNaN(p.latitude) && !Number.isNaN(p.longitude));
}
