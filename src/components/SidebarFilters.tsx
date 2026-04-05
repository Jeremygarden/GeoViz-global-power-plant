import { useEffect, useRef, useState } from "react";
import type { Filters } from "../types";
import { useLang } from "../lib/i18n";

export function SidebarFilters({ filters, onChange, energyOptions, countryOptions }: {
  filters: Filters;
  onChange: (f: Filters) => void;
  energyOptions: string[];
  countryOptions: string[];
}) {
  const { t } = useLang();
  const [countrySearch, setCountrySearch] = useState("");
  const [localMin, setLocalMin] = useState(filters.capacityRange[0]);
  const [localMax, setLocalMax] = useState(filters.capacityRange[1]);

  useEffect(() => {
    setLocalMin(filters.capacityRange[0]);
    setLocalMax(filters.capacityRange[1]);
  }, [filters.capacityRange[0], filters.capacityRange[1]]);

  const toggle = (key: "energyTypes" | "countries", value: string) => {
    const list = filters[key];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    onChange({ ...filters, [key]: next });
  };

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const commitRange = (min: number, max: number) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange({ ...filters, capacityRange: [min, max] });
    }, 300);
  };

  const sliderMax = Math.max(localMax, filters.capacityRange[1], 5000);

  const filteredCountries = countryOptions.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="cyber-panel p-4 space-y-5">
      {/* Energy Type */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-cyber-glow/80 mb-2">{t.filters.energyType}</div>
        <div className="flex flex-wrap gap-2">
          {energyOptions.map((e) => (
            <button key={e} onClick={() => toggle("energyTypes", e)}
              className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                filters.energyTypes.includes(e)
                  ? "border-cyber-glow text-cyber-glow bg-cyber-glow/10"
                  : "border-white/10 text-white/60 hover:border-white/30 hover:text-white/80"
              }`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity double-ended slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-[11px] uppercase tracking-widest text-cyber-glow/80">{t.filters.capacity}</div>
          <div className="text-[11px] text-white/50 tabular-nums">
            {localMin.toLocaleString()} – {localMax.toLocaleString()} MW
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 w-6">{t.filters.min}</span>
            <input
              type="range"
              min={0}
              max={sliderMax}
              value={localMin}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), localMax - 1);
                setLocalMin(v);
                commitRange(v, localMax);
              }}
              className="flex-1 accent-cyber-glow"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 w-6">{t.filters.max}</span>
            <input
              type="range"
              min={0}
              max={sliderMax}
              value={localMax}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), localMin + 1);
                setLocalMax(v);
                commitRange(localMin, v);
              }}
              className="flex-1 accent-cyber-glow"
            />
          </div>
        </div>
      </div>

      {/* Country */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-cyber-glow/80 mb-2">{t.filters.country}</div>
        <input
          type="text"
          placeholder={t.filters.searchCountries}
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
          className="w-full mb-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 placeholder-white/30 focus:border-cyber-glow/50 focus:outline-none"
        />
        <div className="max-h-40 overflow-auto space-y-0.5 pr-1">
          {filteredCountries.map((c) => (
            <button key={c} onClick={() => toggle("countries", c)}
              className={`block w-full text-left rounded px-1.5 py-0.5 text-xs transition-colors ${
                filters.countries.includes(c)
                  ? "text-cyber-blue bg-cyber-blue/10"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5"
              }`}>
              {c}
            </button>
          ))}
          {filteredCountries.length === 0 && (
            <div className="text-xs text-white/30 px-1.5 py-1">{t.filters.noMatch}</div>
          )}
        </div>
      </div>
    </div>
  );
}
