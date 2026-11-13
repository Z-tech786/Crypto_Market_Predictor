import express from 'express';
import { Bot } from '../models/Bot.js';
import { SEED_BOTS } from '../utils/seedData.js';

const router = express.Router();
let memoryBots = [...SEED_BOTS];

// Get bots
router.get('/', async (req, res) => {
  try {
    let bots = await Bot.find();
    if (!bots || bots.length === 0) {
      bots = memoryBots;
    }
    return res.json({ success: true, count: bots.length, data: bots });
  } catch (err) {
    return res.json({ success: true, count: memoryBots.length, data: memoryBots });
  }
});

// Toggle bot
router.post('/:id/toggle', async (req, res) => {
  const botId = req.params.id;
  try {
    let bot = await Bot.findOne({ botId });
    if (bot) {
      bot.active = !bot.active;
      await bot.save();
      return res.json({ success: true, message: `Bot ${bot.name} is now ${bot.active ? 'ACTIVE' : 'PAUSED'}`, data: bot });
    }

    const mBot = memoryBots.find(b => b.botId === botId);
    if (mBot) {
      mBot.active = !mBot.active;
      return res.json({ success: true, message: `Bot ${mBot.name} is now ${mBot.active ? 'ACTIVE' : 'PAUSED'}`, data: mBot });
    }

    return res.status(404).json({ success: false, message: 'Bot not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
