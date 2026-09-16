import { useEffect, useState } from 'react';
import { fetchAssets } from '../api/client';
import { useAssetsSocket } from '../hooks/useAssetsSocket';
import type { AssetSummary } from '../types';
import AssetCard from '../components/AssetCard';

export default function AssetList() {
  const [assets, setAssets] = useState<AssetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { assets: liveAssets, connected } = useAssetsSocket();

  // initial load via plain REST — works even before the socket connects
  useEffect(() => {
    fetchAssets()
      .then(setAssets)
      .finally(() => setLoading(false));
  }, []);

  // once the socket pushes an update, it takes over as the source of truth
  useEffect(() => {
    if (liveAssets) {
      setAssets(Object.values(liveAssets));
    }
  }, [liveAssets]);

  const bullishCount = assets.filter((a) => a.label === 'Bullish').length;
  const totalWithSignal = assets.filter((a) => a.label).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-500'}`}
          />
          <span className="text-xs uppercase tracking-widest text-slate-400">
            {connected ? 'Live' : 'Connecting…'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">Market Signals</h1>
        <p className="mt-1 text-slate-400">
          Indicator confluence across gold, silver, and major crypto — not a prediction, a
          read on where multiple signals currently agree.
        </p>
        {totalWithSignal > 0 && (
          <p className="mt-3 text-sm text-slate-300">
            <span className="font-semibold text-white">{bullishCount}</span> of{' '}
            {totalWithSignal} assets currently bullish
          </p>
        )}
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
