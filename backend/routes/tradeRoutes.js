import express from 'express';
import { Trade } from '../models/Trade.js';
import { User } from '../models/User.js';

const router = express.Router();

// Memory store fallback if MongoDB is not connected
let memoryWallet = {
  usdtBalance: 10000.0,
  holdings: [
    { coinId: 'bitcoin', symbol: 'BTC', amount: 0.08, avgBuyPrice: 65200.0 },
    { coinId: 'ethereum', symbol: 'ETH', amount: 0.95, avgBuyPrice: 3380.0 },
    { coinId: 'solana', symbol: 'SOL', amount: 6.5, avgBuyPrice: 165.0 }
  ],
  trades: [
    {
      tradeId: 'tx-init-1',
      type: 'BUY',
      symbol: 'BTC',
      coinId: 'bitcoin',
      amount: 0.08,
      price: 65200.0,
      total: 5216.0,
      orderType: 'MARKET',
      strategy: 'Manual',
      status: 'FILLED',
      timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    }
  ]
};

// Get Wallet
router.get('/wallet', async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        usdtBalance: memoryWallet.usdtBalance,
        holdings: memoryWallet.holdings
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get Trade History
router.get('/history', async (req, res) => {
  try {
    const dbTrades = await Trade.find().sort({ timestamp: -1 }).limit(50);
    if (dbTrades && dbTrades.length > 0) {
      return res.json({ success: true, count: dbTrades.length, data: dbTrades });
    }
    return res.json({ success: true, count: memoryWallet.trades.length, data: memoryWallet.trades });
  } catch (err) {
    return res.json({ success: true, count: memoryWallet.trades.length, data: memoryWallet.trades });
  }
});

// Execute Paper Trade
router.post('/', async (req, res) => {
  try {
    const { type, symbol, coinId, amount, price, orderType = 'MARKET', strategy = 'Manual Trader' } = req.body;
    const numAmount = Number(amount);
    const numPrice = Number(price);

    if (!type || !symbol || !numAmount || numAmount <= 0 || !numPrice || numPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid trade parameters.' });
    }

    const totalCost = numAmount * numPrice;

    if (type === 'BUY') {
      if (memoryWallet.usdtBalance < totalCost) {
        return res.status(400).json({
          success: false,
          message: `Insufficient USDT balance. Required: $${totalCost.toFixed(2)}, Available: $${memoryWallet.usdtBalance.toFixed(2)}`
        });
      }

      memoryWallet.usdtBalance -= totalCost;

      // Update holdings
      const holdingIdx = memoryWallet.holdings.findIndex(h => h.coinId === coinId || h.symbol === symbol);
      if (holdingIdx >= 0) {
        const cur = memoryWallet.holdings[holdingIdx];
        const newAmt = cur.amount + numAmount;
        const newAvg = (cur.amount * cur.avgBuyPrice + totalCost) / newAmt;
        memoryWallet.holdings[holdingIdx] = { ...cur, amount: newAmt, avgBuyPrice: newAvg };
      } else {
        memoryWallet.holdings.push({
          coinId: coinId || symbol.toLowerCase(),
          symbol,
          amount: numAmount,
          avgBuyPrice: numPrice
        });
      }
    } else if (type === 'SELL') {
      const holdingIdx = memoryWallet.holdings.findIndex(h => h.coinId === coinId || h.symbol === symbol);
      if (holdingIdx < 0 || memoryWallet.holdings[holdingIdx].amount < numAmount) {
        return res.status(400).json({ success: false, message: `Insufficient ${symbol} holdings to sell.` });
      }

      memoryWallet.usdtBalance += totalCost;
      const remaining = memoryWallet.holdings[holdingIdx].amount - numAmount;
      if (remaining > 0) {
        memoryWallet.holdings[holdingIdx].amount = remaining;
      } else {
        memoryWallet.holdings.splice(holdingIdx, 1);
      }
    }

    const newTrade = {
      tradeId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      symbol,
      coinId: coinId || symbol.toLowerCase(),
      amount: numAmount,
      price: numPrice,
      total: totalCost,
      orderType,
      strategy,
      status: 'FILLED',
      timestamp: new Date()
    };

    memoryWallet.trades.unshift(newTrade);

    // Save to MongoDB if available
    try {
      await Trade.create(newTrade);
    } catch (saveErr) {
      // Ignored if DB offline
    }

    return res.status(201).json({
      success: true,
      message: `Simulated ${type} order executed successfully!`,
      data: newTrade,
      wallet: {
        usdtBalance: memoryWallet.usdtBalance,
        holdings: memoryWallet.holdings
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Reset Wallet
router.post('/reset', async (req, res) => {
  memoryWallet.usdtBalance = 10000.0;
  memoryWallet.holdings = [];
  memoryWallet.trades = [];

  return res.json({
    success: true,
    message: 'Paper wallet reset to $10,000.00 USDT balance.',
    data: {
      usdtBalance: 10000.0,
      holdings: []
    }
  });
});

export default router;
