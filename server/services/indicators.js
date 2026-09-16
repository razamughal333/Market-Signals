const { RSI, MACD, SMA } = require('technicalindicators');

/**
 * Takes an array of candles (oldest → newest) and returns:
 *  - the latest price
 *  - a composite 0-100 signal score (50 = neutral)
 *  - a Bullish/Neutral/Bearish label
 *  - the individual indicator verdicts that produced that score (for the "why" breakdown)
 *
 * This is intentionally NOT a prediction — it's a confluence reading:
 * "how many of these 3 indicators currently agree, and which way."
 */
function computeIndicators(candles) {
  const closes = candles.map((c) => c.close);
  const lastClose = closes[closes.length - 1];

  const signals = [];

  // --- RSI: momentum. Below 30 = oversold (often a bullish signal), above 70 = overbought (bearish) ---
  const rsiSeries = RSI.calculate({ period: 14, values: closes });
  const lastRSI = rsiSeries[rsiSeries.length - 1];
  if (lastRSI !== undefined) {
    if (lastRSI < 30) {
      signals.push({ name: 'RSI', verdict: 'bullish', detail: `RSI ${lastRSI.toFixed(1)} — oversold` });
    } else if (lastRSI > 70) {
      signals.push({ name: 'RSI', verdict: 'bearish', detail: `RSI ${lastRSI.toFixed(1)} — overbought` });
    } else {
      signals.push({ name: 'RSI', verdict: 'neutral', detail: `RSI ${lastRSI.toFixed(1)}` });
    }
  }

  // --- MACD: trend direction. MACD line above its signal line = bullish momentum ---
  const macdSeries = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const lastMACD = macdSeries[macdSeries.length - 1];
  if (lastMACD && lastMACD.MACD !== undefined && lastMACD.signal !== undefined) {
    if (lastMACD.MACD > lastMACD.signal) {
      signals.push({ name: 'MACD', verdict: 'bullish', detail: 'MACD line above signal line' });
    } else {
      signals.push({ name: 'MACD', verdict: 'bearish', detail: 'MACD line below signal line' });
    }
  }

  // --- Moving averages: shorter-term trend vs longer-term trend ---
  const sma20Series = SMA.calculate({ period: 20, values: closes });
  const sma50Series = SMA.calculate({ period: 50, values: closes });
  const lastSMA20 = sma20Series[sma20Series.length - 1];
  const lastSMA50 = sma50Series[sma50Series.length - 1];
  if (lastSMA20 !== undefined && lastSMA50 !== undefined) {
    if (lastSMA20 > lastSMA50) {
      signals.push({ name: 'Moving Average', verdict: 'bullish', detail: '20-period average above 50-period' });
    } else {
      signals.push({ name: 'Moving Average', verdict: 'bearish', detail: '20-period average below 50-period' });
    }
  }

  // --- Combine into one score ---
  const bullishCount = signals.filter((s) => s.verdict === 'bullish').length;
  const bearishCount = signals.filter((s) => s.verdict === 'bearish').length;
  const total = signals.length;

  let score = 50; // neutral default if we somehow have no signals
  if (total > 0) {
    score = Math.round(((bullishCount - bearishCount) / total) * 50 + 50); // maps to 0-100
  }

  let label = 'Neutral';
  if (score >= 65) label = 'Bullish';
  else if (score <= 35) label = 'Bearish';

  return {
    price: lastClose,
    score,
    label,
    signals,
  };
}

module.exports = { computeIndicators };
