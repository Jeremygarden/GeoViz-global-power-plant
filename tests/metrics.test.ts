import { test, expect } from "vitest";
import { computeMetrics } from "../src/lib/data/metrics";
import { Plant } from "../src/types";

const sample: Plant[] = [
  { name: "A", latitude: 1, longitude: 1, country: "US", primary_fuel: "Coal", capacity_mw: 100 },
  { name: "B", latitude: 2, longitude: 2, country: "US", primary_fuel: "Solar", capacity_mw: 20 },
];

test("metrics aggregates correctly", () => {
  const out = computeMetrics(sample);
  expect(out.totalCapacity).toBe(120);
  expect(out.plantCount).toBe(2);
  expect(out.countryCount).toBe(1);
});

test("metrics handles empty input", () => {
  const out = computeMetrics([]);
  expect(out.totalCapacity).toBe(0);
  expect(out.plantCount).toBe(0);
  expect(out.countryCount).toBe(0);
});

test("metrics counts zero-capacity plants", () => {
  const out = computeMetrics([
    { name: "Zero", latitude: 0, longitude: 0, country: "US", primary_fuel: "Wind", capacity_mw: 0 },
  ]);
  expect(out.totalCapacity).toBe(0);
  expect(out.plantCount).toBe(1);
  expect(out.countryCount).toBe(1);
});
