import { test, expect } from "vitest";
import { filterPlants } from "../src/lib/data/filters";
import { Plant } from "../src/types";

const sample: Plant[] = [
  { name: "A", latitude: 1, longitude: 1, country: "US", primary_fuel: "Coal", capacity_mw: 100 },
  { name: "B", latitude: 2, longitude: 2, country: "CN", primary_fuel: "Solar", capacity_mw: 20 },
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
