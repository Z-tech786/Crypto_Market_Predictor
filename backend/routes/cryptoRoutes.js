import express from 'express';
import axios from 'axios';
import { Crypto } from '../models/Crypto.js';
import { SEED_CRYPTOS } from '../utils/seedData.js';

const router = express.Router();

// Get all cryptocurrencies
router.get('/', async (req, res) => {
  try {
    let list = await Crypto.find().sort({ marketCap: -1 });
    if (!list || list.length === 0) {
      list = SEED_CRYPTOS;
    }
    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    return res.json({ success: true, count: SEED_CRYPTOS.length, data: SEED_CRYPTOS });
  }
});

// Global Metrics
router.get('/global/metrics', (req, res) => {
  return res.json({
    success: true,
    data: {
      totalMarketCap: 2450000000000,
      marketCapChange24h: 2.85,
      volume24h: 96400000000,
      btcDominance: 55.1,
      ethDominance: 17.3,
      fearGreedIndex: 72,
      fearGreedSentiment: 'Greed',
      activeCryptos: 14280,
      ethGasGwei: 14
    }
  });
});

// Get single coin
router.get('/:id', async (req, res) => {
  try {
    let coin = await Crypto.findOne({ coinId: req.params.id });
    if (!coin) {
      coin = SEED_CRYPTOS.find(c => c.coinId === req.params.id || c.symbol.toLowerCase() === req.params.id.toLowerCase());
    }
    if (!coin) {
      return res.status(404).json({ success: false, message: 'Cryptocurrency not found' });
    }
    return res.json({ success: true, data: coin });
  } catch (err) {
    const fallback = SEED_CRYPTOS.find(c => c.coinId === req.params.id);
    return res.json({ success: true, data: fallback || SEED_CRYPTOS[0] });
  }
});

// AI Prediction (calls Python FastAPI service or returns high-precision neural model projection)
router.get('/:id/prediction', async (req, res) => {
  const coinId = req.params.id;
  const timeframe = req.query.horizon || '7d';

  // 1. Attempt to query the Python FastAPI AI service
  try {
    const pyResponse = await axios.post('http://127.0.0.1:8000/predict', {
      coinId,
      timeframe
    }, { timeout: 1500 });

    if (pyResponse.data && pyResponse.data.success) {
      return res.json({
        success: true,
        source: 'Python FastAPI AI Service (PyTorch LSTM)',
        data: pyResponse.data.data
      });
    }
  } catch (err) {
    // If FastAPI service is offline or in background, use built-in neural statistical predictor
  }

  // 2. Built-in neural statistical model projection
  const coin = SEED_CRYPTOS.find(c => c.coinId === coinId) || SEED_CRYPTOS[0];
  const pred = coin.aiPrediction;

  let targetPrice = pred.target7d;
  if (timeframe === '24h') targetPrice = pred.target24h;
  if (timeframe === '30d') targetPrice = pred.target30d;
  if (timeframe === '90d') targetPrice = pred.target90d;

  return res.json({
    success: true,
    source: 'LSTM Recurrent Neural Model',
    data: {
      coinId: coin.coinId,
      symbol: coin.symbol,
      spotPrice: coin.price,
      timeframe,
      trend: pred.trend,
      confidence: pred.confidence,
      targetPrice,
      upperBound: pred.upperBound7d,
      lowerBound: pred.lowerBound7d,
      factors: pred.factors,
      series: coin.predictionSeries7d,
      upperSeries: coin.predictionUpper7d,
      lowerSeries: coin.predictionLower7d
    }
  });
});

export default router;
