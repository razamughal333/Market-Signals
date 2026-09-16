const assets = require('../data/assets');
const { getTimeSeries } = require('./twelveData');
const { computeIndicators } = require('./indicators');
const cache = require('./cache');

async function refreshAsset(asset) {
  try {
    const interval = '1h';
    const candles = await getTimeSeries(asset.symbol, interval, 100);
    const result = computeIndicators(candles);
    const data = { ...asset, ...result, interval, candles };
    await cache.setAsset(asset.id, data);
    return await cache.getAsset(asset.id);
  } catch (err) {
    console.error(`Failed to refresh ${asset.symbol}: ${err.message}`);
    return null;
  }
}

async function refreshAll() {
  // Twelve Data's free tier allows 8 requests/minute — fetching all 4 assets back-to-back
  // instantly risks hitting that limit, so we space them out by a little over a second each.
  for (const asset of assets) {
    await refreshAsset(asset);
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  return cache.getAll();
}

module.exports = { refreshAsset, refreshAll };
