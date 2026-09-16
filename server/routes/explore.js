const express = require('express');
const router = express.Router();
const { getTimeSeries } = require('../services/twelveData');
const { computeIndicators } = require('../services/indicators');

// GET /api/explore?symbol=EUR/USD — fetches + scores ANY symbol on demand.
// Uses a query param (not a path param) because many symbols contain "/"
// (e.g. "EUR/USD"), which doesn't play nicely with Express route params.
router.get('/', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  try {
    const interval = '1h';
    const candles = await getTimeSeries(symbol, interval, 100);
    const result = computeIndicators(candles);
    res.json({ id: symbol, symbol, name: symbol, type: 'other', interval, ...result, candles });
  } catch (err) {
    console.error(`Explore lookup failed for ${symbol}:`, err.message);
    res.status(502).json({ error: `Could not load data for ${symbol}. It may not be on your Twelve Data plan.` });
  }
});

module.exports = router;
