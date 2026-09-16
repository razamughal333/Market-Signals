import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchAssetDetail } from '../api/client';
import type { AssetDetail as AssetDetailType } from '../types';
import AssetInsight from '../components/AssetInsight';

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<AssetDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setAsset(null);
    setError(null);
    fetchAssetDetail(id)
      .then(setAsset)
      .catch(() => setError('Could not load this asset right now.'));
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link to="/" className="mb-8 inline-block text-sm text-slate-400 hover:text-white">
        ← Back to all assets
      </Link>

      {error && <p className="text-red-400">{error}</p>}

      {!asset && !error && (
        <div className="space-y-4">
          <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
          <div className="h-96 w-full animate-pulse rounded-2xl bg-white/5" />
        </div>
      )}

      {asset && <AssetInsight asset={asset} />}
    </div>
  );
}
