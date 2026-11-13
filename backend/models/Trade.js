import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  tradeId: { type: String, required: true },
  userId: { type: String, default: 'demo-user' },
  userEmail: { type: String, default: 'trader@academic.edu' },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  symbol: { type: String, required: true },
  coinId: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  orderType: { type: String, enum: ['MARKET', 'LIMIT'], default: 'MARKET' },
  strategy: { type: String, default: 'Manual' },
  status: { type: String, default: 'FILLED' },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Trade = mongoose.model('Trade', tradeSchema);
