const axios = require('axios');

const BASE_URL = 'https://api.twelvedata.com';

/**
 * Fetches historical price candles for a symbol from Twelve Data.
 * Docs: https://twelvedata.com/docs#time-series
 *
 * @param {string} symbol - e.g. "XAU/USD", "BTC/USD"
 * @param {string} interval - e.g. "1h", "1day"
 * @param {number} outputsize - how many candles to pull (max 5000, we only need ~100)
 */
async function getTimeSeries(symbol, interval = '1h', outputsize = 100) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    throw new Error('TWELVE_DATA_API_KEY is missing from .env');
  }

  const response = await axios.get(`${BASE_URL}/time_series`, {
    params: { symbol, interval, outputsize, apikey: apiKey },
  });

  // Twelve Data returns HTTP 200 even on errors (bad symbol, rate limit, etc.)
  // — the actual error lives in the response body, so we have to check it manually.
  if (response.data.status === 'error') {
    throw new Error(response.data.message || `Twelve Data returned an error for ${symbol}`);
  }

  if (!response.data.values || response.data.values.length === 0) {
    throw new Error(`No data returned for ${symbol}`);
  }

  // Twelve Data returns candles newest-first. Indicator math (RSI, MACD, etc.)
  // needs oldest-first, so we reverse here — once — rather than in every caller.
  return response.data.values
    .slice()
    .reverse()
    .map((candle) => ({
      datetime: candle.datetime,
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: candle.volume ? parseFloat(candle.volume) : null,
    }));
}

module.exports = { getTimeSeries };

/**
 * Searches Twelve Data's full instrument catalog (stocks, forex, crypto, etc.)
 * Docs: https://twelvedata.com/docs#symbol-search
 */
async function searchSymbols(query) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    throw new Error('TWELVE_DATA_API_KEY is missing from .env');
  }

  const response = await axios.get(`${BASE_URL}/symbol_search`, {
    params: { symbol: query, apikey: apiKey },
  });

  const results = response.data.data || [];
  return results.slice(0, 15).map((r) => ({
    symbol: r.symbol,
    name: r.instrument_name,
    exchange: r.exchange,
    type: r.instrument_type,
    country: r.country,
  }));
}

module.exports.searchSymbols = searchSymbols;
