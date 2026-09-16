const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema(
  {
    name: String,
    verdict: String,
    detail: String,
  },
  { _id: false }
);

const candleSchema = new mongoose.Schema(
  {
    datetime: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
  },
  { _id: false }
);

const assetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. "gold" — matches data/assets.js
  symbol: String,
  name: String,
  type: String,
  interval: String,
  price: Number,
  score: Number,
  label: String,
  signals: [signalSchema],
  candles: [candleSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);
