const items = [
  { color: '#f87171', label: 'Bearish', hint: 'toward 0 — more indicators agree bearish' },
  { color: '#94a3b8', label: 'Neutral', hint: '50 — indicators mixed or unclear' },
  { color: '#34d399', label: 'Bullish', hint: 'toward 100 — more indicators agree bullish' },
];

export default function ScoreLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium text-slate-300">{item.label}</span>
          <span className="hidden sm:inline">— {item.hint}</span>
        </div>
      ))}
    </div>
  );
}
