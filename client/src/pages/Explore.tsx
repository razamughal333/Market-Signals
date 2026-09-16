import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchExplore } from '../api/client';
import type { AssetDetail } from '../types';
import AssetInsight from '../components/AssetInsight';

export default function Explore() {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol');
  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    setAsset(null);
    setError(null);
    fetchExplore(symbol)
      .then(setAsset)
      .catch(() => setError(`Could not load data for ${symbol}. It may not be on your Twelve Data plan.`));
  }, [symbol]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link to="/search" className="mb-8 inline-block text-sm text-slate-400 hover:text-white">
        ← Back to search
      </Link>

      {!symbol && <p className="text-slate-400">No symbol specified.</p>}
      {error && <p className="text-red-400">{error}</p>}

      {symbol && !asset && !error && (
        <div className="space-y-4">
          <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
          <div className="h-96 w-full animate-pulse rounded-2xl bg-white/5" />
        </div>
      )}

      {asset && <AssetInsight asset={asset} />}
    </div>
  );
}
