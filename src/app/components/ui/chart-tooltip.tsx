export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-3.5 py-2.5 shadow-xl">
      {label != null && (
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color || entry.stroke || "#16a34a" }}
            />
            <span className="text-slate-600">{entry.name}</span>
            <span className="ml-auto pl-6 font-mono font-bold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartLegend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span
          key={it.name}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600"
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: it.color }} />
          {it.name}
        </span>
      ))}
    </div>
  );
}