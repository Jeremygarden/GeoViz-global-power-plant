import type { Plant } from "../types";
import { useLang } from "../lib/i18n";

export function Tooltip({ plant, x, y }: { plant: Plant | null; x: number; y: number }) {
  const { t } = useLang();
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
      <div>{plant.capacity_mw} {t.tooltip.capacity}</div>
    </div>
  );
}
