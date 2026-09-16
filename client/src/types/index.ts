export type Verdict = 'bullish' | 'bearish' | 'neutral';

export interface IndicatorSignal {
  name: string;
  verdict: Verdict;
  detail: string;
}

export interface Candle {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

// Shape returned by GET /api/assets (list page — no candle history)
export interface AssetSummary {
  id: string;
  symbol: string;
  name: string;
  type: 'metal' | 'crypto';
  price?: number;
  score?: number;
  label?: 'Bullish' | 'Bearish' | 'Neutral';
  signals?: IndicatorSignal[];
  updatedAt?: string;
  status?: 'loading';
}

// Shape returned by GET /api/assets/:id (detail page — full history)
export interface AssetDetail extends AssetSummary {
  candles: Candle[];
  interval?: string; // e.g. "1h" — which candle timeframe this data uses
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  country?: string;
}

// What the backend pushes over the assets:update socket event —
// an object keyed by asset id, same shape as AssetDetail per entry.
export type AssetsMap = Record<string, AssetDetail>;
