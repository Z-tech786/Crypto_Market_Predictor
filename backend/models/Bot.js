import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
  botId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  riskLevel: { type: String, enum: ['Conservative', 'Moderate', 'Aggressive'], default: 'Moderate' },
  targetPair: { type: String, default: 'BTC/USDT' },
  recommendedHorizon: { type: String, default: 'Daily (24H)' },
  winRate: { type: String, default: '70%' },
  tradesCount: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
  color: { type: String, default: '#06b6d4' }
}, {
  timestamps: true
});

export const Bot = mongoose.model('Bot', botSchema);
