export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white">About this project</h1>

      <p className="mt-4 text-slate-300">
        Market Signals is a confluence dashboard — it shows where multiple technical indicators
        currently agree or disagree on gold, silver-adjacent metals, and major crypto. It does{' '}
        <strong className="text-white">not</strong> predict future price movement, and there's no
        buy or sell button anywhere in this app.
      </p>

      <h2 className="mt-10 text-lg font-semibold text-white">How the score is built</h2>
      <p className="mt-3 text-slate-300">
        For each asset, the backend pulls recent price candles and computes three independent
        technical indicators:
      </p>
      <ul className="mt-4 space-y-3 text-slate-300">
        <li>
          <strong className="text-white">RSI (Relative Strength Index)</strong> — measures
          momentum. Readings below 30 suggest an asset is oversold (often read as bullish);
          above 70 suggests overbought (often read as bearish).
        </li>
        <li>
          <strong className="text-white">MACD</strong> — compares short and long-term trend
          lines. When the MACD line sits above its signal line, that's read as bullish momentum;
          below, bearish.
        </li>
        <li>
          <strong className="text-white">Moving averages</strong> — compares a 20-period average
          against a 50-period average. Shorter above longer is read as an emerging uptrend.
        </li>
      </ul>
      <p className="mt-4 text-slate-300">
        Each indicator casts one "vote" — bullish, bearish, or neutral. The composite score
        (0–100) reflects how many of those votes agree, and in which direction. A score near 50
        means the indicators are mixed or unclear — not a confident reading either way.
      </p>

      <h2 className="mt-10 text-lg font-semibold text-white">What this isn't</h2>
      <p className="mt-3 text-slate-300">
        This is not financial advice, and it's not a trading signal to act on. It's a way to see,
        at a glance, whether commonly-used indicators are pointing the same direction — nothing
        more. Markets are influenced by far more than three technical indicators, and past
        indicator agreement doesn't guarantee future price movement.
      </p>

      <h2 className="mt-10 text-lg font-semibold text-white">Stack</h2>
      <p className="mt-3 text-slate-300">
        React, TypeScript, and Tailwind on the frontend; Node.js and Express on the backend, with
        live price data from Twelve Data, indicator math via the{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">technicalindicators</code>{' '}
        library, and Socket.io for pushing live updates to the dashboard.
      </p>
    </div>
  );
}
