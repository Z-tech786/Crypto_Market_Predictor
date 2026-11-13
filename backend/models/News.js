import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  newsId: { type: String, required: true },
  title: { type: String, required: true },
  source: { type: String, default: 'CoinDesk Intelligence' },
  time: { type: String, default: 'Just now' },
  category: { type: String, default: 'General' },
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'], default: 'Positive' },
  sentimentScore: { type: Number, default: 0.5 },
  summary: { type: String, default: '' },
  impact: { type: String, default: 'Moderate Bullish' },
  url: { type: String, default: '#' }
}, {
  timestamps: true
});

export const News = mongoose.model('News', newsSchema);
