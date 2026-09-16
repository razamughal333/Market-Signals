import { Link } from 'react-router-dom';
import type { AssetSummary } from '../types';
import SignalBadge from './SignalBadge';

export default function AssetCard({ asset }: { asset: AssetSummary }) {
  const isLoading = asset.status === 'loading' || asset.price === undefined;

  return (
    <Link
      to={`/asset/${asset.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
          <p className="text-xs uppercase tracking-wide text-slate-400">{asset.symbol}</p>
        </div>
        {!isLoading && <SignalBadge label={asset.label} />}
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="h-8 w-32 animate-pulse rounded bg-white/10" />
        ) : (
          <span className="text-2xl font-bold text-white">
            $
            {asset.price!.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        )}
      </div>

      {!isLoading && asset.score !== undefined && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${asset.score}%`,
              backgroundColor: asset.score >= 65 ? '#34d399' : asset.score <= 35 ? '#f87171' : '#94a3b8',
            }}
          />
        </div>
      )}
    </Link>
  );
}
