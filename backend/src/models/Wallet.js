import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
  {
    coinId: { type: String, required: true },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    avgBuyPrice: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const tradeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, required: true },
    status: { type: String, default: 'FILLED' },
    orderType: { type: String, enum: ['MARKET', 'LIMIT'], required: true },
    strategy: { type: String, required: true, maxlength: 100 }
  },
  { _id: false }
);

const botSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    active: { type: Boolean, default: false }
  },
  { _id: false }
);

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    usdtBalance: { type: Number, default: 10000, min: 0 },
    holdings: { type: [holdingSchema], default: [] },
    tradeHistory: { type: [tradeSchema], default: [] },
    bots: { type: [botSchema], default: [] }
  },
  { timestamps: true }
);

export const Wallet = mongoose.model('Wallet', walletSchema);
