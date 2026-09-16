// The 4 assets this dashboard tracks.
// `symbol` is the exact ticker Twelve Data expects.
// `id` is what we use internally (URLs, cache keys) — keep it lowercase, no spaces.
module.exports = [
  { id: "gold", symbol: "XAU/USD", name: "Gold", type: "metal" },
  { id: "tsla", symbol: "TSLA", name: "Tesla", type: "stock" },
  { id: "btc", symbol: "BTC/USD", name: "Bitcoin", type: "crypto" },
  { id: "eth", symbol: "ETH/USD", name: "Ethereum", type: "crypto" },
];
