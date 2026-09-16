import type { AssetDetail as AssetDetailType, Verdict } from '../types';
import ScoreGauge from './ScoreGauge';
import ScoreLegend from './ScoreLegend';
import SignalBadge from './SignalBadge';
import PriceChart from './PriceChart';

const verdictColor: Record<Verdict, string> = {
  bullish: 'text-emerald-400',
  bearish: 'text-red-400',
  neutral: 'text-slate-400',
};

const verdictSymbol: Record<Verdict, string> = {
  bullish: '▲',
  bearish: '▼',
  neutral: '—',
};

export default function AssetInsight({ asset }: { asset: AssetDetailType }) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">{asset.symbol}</p>
          <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-white">
            $
            {asset.price?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreGauge score={asset.score ?? 50} />
          <SignalBadge label={asset.label} />
        </div>
      </div>

      <div className="mb-8">
        <ScoreLegend />
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Price chart
          </span>
          {asset.interval && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
              {asset.interval.toUpperCase()} candles
            </span>
          )}
        </div>
        <PriceChart candles={asset.candles} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Why this score
        </h2>
        <ul className="space-y-3">
          {asset.signals?.map((signal) => (
            <li
              key={signal.name}
              className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-white">{signal.name}</p>
                <p className="text-sm text-slate-400">{signal.detail}</p>
              </div>
              <span className={`text-lg font-bold ${verdictColor[signal.verdict]}`}>
                {verdictSymbol[signal.verdict]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
