import { Plant } from "../types";

export function Tooltip({ plant, x, y }: { plant: Plant | null; x: number; y: number }) {
  if (!plant) return null;
  return (
    <div
      className="fixed z-50 rounded-xl border border-cyber-glow/40 bg-[#0b1118]/90 p-3 text-xs text-white shadow-xl"
      style={{ left: x + 12, top: y + 12 }}
    >
      <div className="font-semibold">{plant.name}</div>
      <div>
        {plant.country} · {plant.primary_fuel}
      </div>
      <div>{plant.capacity_mw} MW</div>
    </div>
  );
}
