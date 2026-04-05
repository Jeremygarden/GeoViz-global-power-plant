import type { Plant } from "../../types";
import Papa from "papaparse";

const CSV_URL = "https://raw.githubusercontent.com/wri/global-power-plant-database/master/output_database/global_power_plant_database.csv";
const CACHE_KEY = "geoviz_plants_cache";
const CACHE_TTL = 24 * 60 * 60 * 1000;

type CsvRow = {
  country: string;
  name: string;
  capacity_mw: string;
  latitude: string;
  longitude: string;
  primary_fuel: string;
};

async function fetchAndParsePlants(): Promise<Plant[]> {
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

export async function loadPlants(): Promise<Plant[]> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached: { ts: number; data: Plant[] } = JSON.parse(raw);
      if (Date.now() - cached.ts < CACHE_TTL) {
        return cached.data;
      }
    }
  } catch {
    // ignore cache read errors
  }

  const plants = await fetchAndParsePlants();

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), data: plants })
    );
  } catch {
    // ignore cache write errors
  }

  return plants;
}
