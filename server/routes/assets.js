const express = require('express');
const router = express.Router();

const cache = require('../services/cache');
const assetsConfig = require('../data/assets');
const { refreshAsset } = require('../services/refresh');

// GET /api/assets — the list page: all 4 assets with their latest price + signal
router.get('/', async (req, res) => {
  const all = await cache.getAll();
  const list = assetsConfig.map((asset) => {
    const data = all[asset.id];
    if (!data) return { ...asset, status: 'loading' };
    const { candles, ...summary } = data; // don't send full candle history to the list page
    return summary;
  });
  res.json(list);
});

// GET /api/assets/:id — the detail page: full candle history + indicator breakdown
router.get('/:id', async (req, res) => {
  const asset = assetsConfig.find((a) => a.id === req.params.id);
  if (!asset) {
    return res.status(404).json({ error: 'Unknown asset' });
  }

  let data = await cache.getAsset(asset.id);
  if (!data) {
    data = await refreshAsset(asset); // first request ever — fetch on demand
  }
  if (!data) {
    return res.status(503).json({ error: 'Data temporarily unavailable, try again shortly' });
  }

  res.json(data);
});

module.exports = router;
