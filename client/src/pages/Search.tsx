import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchSymbols } from '../api/client';
import type { SearchResult } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchSymbols(query.trim());
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Explore assets</h1>
      <p className="mt-1 text-slate-400">
        Search any stock, forex pair, or crypto — get the same indicator confluence reading, on demand.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “Tesla”, “EUR/USD”, or “Solana”"
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-white/30"
        />
        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-3 font-medium text-slate-900 transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {loading &&
          [0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />)}

        {!loading && searched && results.length === 0 && (
          <p className="text-slate-400">No matches — try a different symbol or company name.</p>
        )}

        {!loading &&
          results.map((r) => (
            <Link
              key={`${r.symbol}-${r.exchange}`}
              to={`/explore?symbol=${encodeURIComponent(r.symbol)}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div>
                <p className="font-medium text-white">{r.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {r.symbol} · {r.exchange}
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase text-slate-300">
                {r.type}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
