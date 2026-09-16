const express = require('express');
const router = express.Router();
const { searchSymbols } = require('../services/twelveData');

// GET /api/search?q=apple — searches ALL instruments Twelve Data covers
// (stocks, forex, crypto, etc.), not just our 4 tracked assets.
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim().length === 0) {
    return res.json([]);
  }

  try {
    const results = await searchSymbols(query.trim());
    res.json(results);
  } catch (err) {
    console.error('Symbol search failed:', err.message);
    res.status(502).json({ error: 'Search failed, try again' });
  }
});

module.exports = router;
