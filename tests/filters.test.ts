import { test, expect } from "vitest";
import { filterPlants } from "../src/lib/data/filters";
import { Plant } from "../src/types";

const sample: Plant[] = [
  { name: "A", latitude: 1, longitude: 1, country: "US", primary_fuel: "Coal", capacity_mw: 100 },
  { name: "B", latitude: 2, longitude: 2, country: "CN", primary_fuel: "Solar", capacity_mw: 20 },
  { name: "C", latitude: 3, longitude: 3, country: "CN", primary_fuel: "Wind", capacity_mw: 0 },
  { name: "D", latitude: 4, longitude: 4, country: "FR", primary_fuel: "Gas", capacity_mw: 5000 },
];

test("filters by energy and capacity", () => {
  const out = filterPlants(sample, {
    energyTypes: ["Coal"],
    countries: [],
    capacityRange: [50, 200],
  });
  expect(out.length).toBe(1);
  expect(out[0].name).toBe("A");
});

test("filters by country", () => {
  const out = filterPlants(sample, {
    energyTypes: [],
    countries: ["CN"],
    capacityRange: [0, 5000],
  });
  expect(out.map((p) => p.name).sort()).toEqual(["B", "C"]);
});

test("passes all when energyTypes empty", () => {
  const out = filterPlants(sample, {
    energyTypes: [],
    countries: [],
    capacityRange: [0, 5000],
  });
  expect(out.length).toBe(sample.length);
});

test("includes capacity boundary values", () => {
  const out = filterPlants(sample, {
    energyTypes: [],
    countries: [],
    capacityRange: [0, 5000],
  });
  expect(out.map((p) => p.name).sort()).toEqual(["A", "B", "C", "D"]);
});
