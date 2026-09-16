import type { AssetSummary } from '../types';

const styles: Record<string, string> = {
  Bullish: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Bearish: 'bg-red-500/15 text-red-400 border-red-500/30',
  Neutral: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export default function SignalBadge({ label }: { label: AssetSummary['label'] }) {
  if (!label) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${styles[label]}`}
    >
      {label}
    </span>
  );
}
