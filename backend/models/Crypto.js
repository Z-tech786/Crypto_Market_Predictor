import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
  coinId: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Layer 1' },
  price: { type: Number, required: true },
  change24h: { type: Number, default: 0 },
  change7d: { type: Number, default: 0 },
  volume24h: { type: Number, default: 0 },
  marketCap: { type: Number, default: 0 },
  circulatingSupply: { type: String, default: '' },
  allTimeHigh: { type: Number, default: 0 },
  color: { type: String, default: '#06b6d4' },
  rsi: { type: Number, default: 50 },
  macd: { type: Number, default: 0 },
  signal: { type: Number, default: 0 },
  sma20: { type: Number, default: 0 },
  sma50: { type: Number, default: 0 },
  sma200: { type: Number, default: 0 },
  bollingerUpper: { type: Number, default: 0 },
  bollingerLower: { type: Number, default: 0 },
  aiSentiment: { type: Number, default: 75 },
  aiPrediction: {
    trend: { type: String, default: 'Bullish' },
    confidence: { type: Number, default: 85.0 },
    target24h: { type: Number, default: 0 },
    target7d: { type: Number, default: 0 },
    target30d: { type: Number, default: 0 },
    target90d: { type: Number, default: 0 },
    upperBound7d: { type: Number, default: 0 },
    lowerBound7d: { type: Number, default: 0 },
    factors: [{
      name: String,
      weight: String,
      impact: String
    }]
  },
  history7d: [{ type: Number }],
  history30d: [{ type: Number }],
  predictionSeries7d: [{ type: Number }],
  predictionUpper7d: [{ type: Number }],
  predictionLower7d: [{ type: Number }]
}, {
  timestamps: true
});

export const Crypto = mongoose.model('Crypto', cryptoSchema);
