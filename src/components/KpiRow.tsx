import { useLang } from "../lib/i18n";

export function KpiRow({ totalCapacity, plantCount, countryCount }: { totalCapacity: number; plantCount: number; countryCount: number }) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[
        { label: t.kpi.totalCapacity, value: `${Math.round(totalCapacity).toLocaleString()} MW` },
        { label: t.kpi.plantCount, value: plantCount.toLocaleString() },
        { label: t.kpi.countries, value: countryCount.toLocaleString() },
      ].map((k) => (
        <div key={k.label} className="cyber-panel p-4">
          <div className="text-[11px] uppercase tracking-widest text-cyber-glow/80">{k.label}</div>
          <div className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-tight">{k.value}</div>
        </div>
      ))}
    </div>
  );
}
