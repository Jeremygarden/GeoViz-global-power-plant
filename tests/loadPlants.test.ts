import { test, expect, vi } from "vitest";
import { loadPlants } from "../src/lib/data/loadPlants";

test("throws on fetch failure", async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: false }) as any;
  await expect(loadPlants()).rejects.toThrow("Failed to fetch dataset");
});

test("filters out NaN coordinates", async () => {
  const csv = "country,name,capacity_mw,latitude,longitude,primary_fuel\nUS,Valid,100,40,-100,Coal\nUS,Bad,50,not-a-number,200,Gas";
  global.fetch = vi.fn().mockResolvedValue({ ok: true, text: async () => csv }) as any;
  const plants = await loadPlants();
  expect(plants.length).toBe(1);
  expect(plants[0].name).toBe("Valid");
});
