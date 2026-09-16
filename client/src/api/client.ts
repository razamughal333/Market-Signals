import axios from 'axios';
import type { AssetSummary, AssetDetail, SearchResult } from '../types';

// In dev, Vite's proxy (see vite.config.ts) forwards "/api" to the Express server.
// In production, set VITE_API_URL to your deployed Render backend URL.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

export async function fetchAssets(): Promise<AssetSummary[]> {
  const res = await api.get<AssetSummary[]>('/assets');
  return res.data;
}

export async function fetchAssetDetail(id: string): Promise<AssetDetail> {
  const res = await api.get<AssetDetail>(`/assets/${id}`);
  return res.data;
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const res = await api.get<SearchResult[]>('/search', { params: { q: query } });
  return res.data;
}

export async function fetchExplore(symbol: string): Promise<AssetDetail> {
  const res = await api.get<AssetDetail>('/explore', { params: { symbol } });
  return res.data;
}
