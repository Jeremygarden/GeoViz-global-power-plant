import { Filters } from "../types";

export function SidebarFilters({ filters, onChange, energyOptions, countryOptions }: {
  filters: Filters;
  onChange: (f: Filters) => void;
  energyOptions: string[];
  countryOptions: string[];
}) {
  const toggle = (key: "energyTypes" | "countries", value: string) => {
    const list = filters[key];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="cyber-panel p-4 space-y-4">
      <div>
        <div className="text-xs text-cyber-glow">Energy Type</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {energyOptions.map((e) => (
            <button key={e} onClick={() => toggle("energyTypes", e)}
              className={`rounded-full px-3 py-1 text-xs border ${filters.energyTypes.includes(e) ? "border-cyber-glow text-cyber-glow" : "border-white/10 text-white/70"}`}>
              {e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-cyber-glow">Capacity (MW)</div>
        <input
          type="range"
          min={0}
          max={5000}
          value={filters.capacityRange[1]}
          onChange={(e) => onChange({ ...filters, capacityRange: [0, Number(e.target.value)] })}
          className="w-full"
        />
      </div>
      <div>
        <div className="text-xs text-cyber-glow">Country</div>
        <div className="mt-2 max-h-40 overflow-auto space-y-1">
          {countryOptions.map((c) => (
            <button key={c} onClick={() => toggle("countries", c)} className={`block w-full text-left text-xs ${filters.countries.includes(c) ? "text-cyber-blue" : "text-white/70"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
