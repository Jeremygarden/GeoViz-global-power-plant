export function KpiRow({ totalCapacity, plantCount, countryCount }: { totalCapacity: number; plantCount: number; countryCount: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[
        { label: "Total Capacity", value: `${Math.round(totalCapacity).toLocaleString()} MW` },
        { label: "Plant Count", value: plantCount.toLocaleString() },
        { label: "Countries", value: countryCount.toLocaleString() },
      ].map((k) => (
        <div key={k.label} className="cyber-panel p-4">
          <div className="text-[11px] uppercase tracking-widest text-cyber-glow/80">{k.label}</div>
          <div className="mt-2 text-2xl font-bold tabular-nums tracking-tight">{k.value}</div>
        </div>
      ))}
    </div>
  );
}
