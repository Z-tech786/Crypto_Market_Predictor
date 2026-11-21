import express from 'express';
import { News } from '../models/News.js';
import { SEED_NEWS } from '../utils/seedData.js';

const router = express.Router();

// Get News
router.get('/', async (req, res) => {
  try {
    let list = await News.find().sort({ createdAt: -1 });
    if (!list || list.length === 0) {
      list = SEED_NEWS;
    }
    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    return res.json({ success: true, count: SEED_NEWS.length, data: SEED_NEWS });
  }
});

// Sentiment Radar
router.get('/sentiment-radar', (req, res) => {
  return res.json({
    success: true,
    data: {
      fearAndGreed: {
        value: 72,
        classification: 'Greed',
        yesterday: 68,
        lastWeek: 64,
        lastMonth: 58
      },
      socialSentiment: {
        positivePercent: 68,
        neutralPercent: 20,
        negativePercent: 12,
        totalMentions24h: '1,420,000+'
      },
      whaleFlow: {
        accumulationScore: '+78 / 100',
        exchangeNetInflow: '-14,250 BTC (Net Cold Storage Outflow)',
        interpretation: 'Strong Accumulation Phase'
      }
    }
  });
});

export default router;
