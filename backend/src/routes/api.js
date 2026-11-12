import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { Progress } from '../models/Progress.js';
import { authenticate } from '../middleware/authenticate.js';

export const apiRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const DEFAULT_BOTS = [
  { id: 'rsi-mean-reversion', active: false },
  { id: 'ai-lstm-momentum', active: false },
  { id: 'dca-accumulator', active: false },
  { id: 'grid-volatility-bot', active: false }
];

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  studentId: user.studentId,
  role: user.role,
  riskTolerance: user.riskTolerance,
  isAuthenticated: true
});

const issueToken = (user) =>
  jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

async function ensureAccountData(userId) {
  const [wallet, progress] = await Promise.all([
    Wallet.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, usdtBalance: 10000, holdings: [], tradeHistory: [], bots: DEFAULT_BOTS } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    Progress.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, completedLessons: [], quizResults: {} } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  ]);
  return { wallet, progress };
}

function validNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.post('/auth/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, studentId, password, role = 'student' } = req.body;
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof studentId !== 'string' ||
      !studentId.trim() ||
      typeof password !== 'string' ||
      password.length < 8 ||
      password.length > 128 ||
      !['student', 'trader'].includes(role)
    ) {
      return res.status(400).json({
        error: 'Provide a name, valid email, student ID, password of at least 8 characters, and a student or trader role.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studentId: studentId.trim(),
      passwordHash,
      role
    });
    await ensureAccountData(user._id);
    res.status(201).json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'That email address or student ID is already registered.' });
    }
    next(error);
  }
});

apiRouter.post('/auth/login', authLimiter, async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (
      typeof identifier !== 'string' ||
      !identifier.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({ error: 'Enter your email or student ID and password.' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.trim().toLowerCase() },
        { studentId: identifier.trim() }
      ]
    }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'The email/student ID or password is incorrect.' });
    }

    await ensureAccountData(user._id);
    res.json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/auth/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

apiRouter.patch('/auth/profile', authenticate, async (req, res, next) => {
  try {
    const { riskTolerance } = req.body;
    if (!['Conservative', 'Moderate', 'Aggressive'].includes(riskTolerance)) {
      return res.status(400).json({ error: 'Choose a valid risk profile.' });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { riskTolerance } },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/portfolio', authenticate, async (req, res, next) => {
  try {
    const { wallet } = await ensureAccountData(req.userId);
    res.json({
      usdtBalance: wallet.usdtBalance,
      holdings: wallet.holdings,
      tradeHistory: [...wallet.tradeHistory].reverse(),
      bots: wallet.bots
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/portfolio/trades', authenticate, async (req, res, next) => {
  try {
    const { type, coinId, symbol, amount, price, orderType = 'MARKET', strategy = 'Manual Trader' } = req.body;
    if (
      !['BUY', 'SELL'].includes(type) ||
      typeof coinId !== 'string' ||
      !/^[a-z0-9-]{1,50}$/.test(coinId) ||
      typeof symbol !== 'string' ||
      !/^[A-Z0-9]{2,12}$/.test(symbol) ||
      !validNumber(amount) ||
      !validNumber(price) ||
      !['MARKET', 'LIMIT'].includes(orderType) ||
      typeof strategy !== 'string' ||
      strategy.length > 100
    ) {
      return res.status(400).json({ error: 'Invalid paper trade details.' });
    }

    const total = amount * price;
    if (!Number.isFinite(total)) {
      return res.status(400).json({ error: 'Trade value is outside the supported range.' });
    }
    await ensureAccountData(req.userId);

    const trade = {
      id: `tx-${randomUUID()}`,
      type,
      symbol,
      amount,
      price,
      total,
      timestamp: new Date(),
      status: 'FILLED',
      orderType,
      strategy
    };

    const holdings = { $ifNull: ['$holdings', []] };
    const matches = {
      $filter: {
        input: holdings,
        as: 'holding',
        cond: { $eq: ['$$holding.coinId', coinId] }
      }
    };
    let update;
    let filter = { userId: req.userId };

    if (type === 'BUY') {
      filter.usdtBalance = { $gte: total };
      update = [
        {
          $set: {
            usdtBalance: { $subtract: ['$usdtBalance', total] },
            holdings: {
              $let: {
                vars: { matches },
                in: {
                  $cond: [
                    { $gt: [{ $size: '$$matches' }, 0] },
                    {
                      $map: {
                        input: holdings,
                        as: 'holding',
                        in: {
                          $cond: [
                            { $eq: ['$$holding.coinId', coinId] },
                            {
                              $mergeObjects: [
                                '$$holding',
                                {
                                  amount: { $add: ['$$holding.amount', amount] },
                                  avgBuyPrice: {
                                    $divide: [
                                      {
                                        $add: [
                                          { $multiply: ['$$holding.amount', '$$holding.avgBuyPrice'] },
                                          total
                                        ]
                                      },
                                      { $add: ['$$holding.amount', amount] }
                                    ]
                                  }
                                }
                              ]
                            },
                            '$$holding'
                          ]
                        }
                      }
                    },
                    {
                      $concatArrays: [
                        holdings,
                        [{ coinId, symbol, amount, avgBuyPrice: price }]
                      ]
                    }
                  ]
                }
              }
            },
            tradeHistory: {
              $slice: [
                { $concatArrays: [{ $ifNull: ['$tradeHistory', []] }, [trade]] },
                -500
              ]
            }
          }
        }
      ];
    } else {
      filter.$expr = {
        $gte: [
          {
            $ifNull: [
              {
                $arrayElemAt: [
                  {
                    $map: {
                      input: matches,
                      as: 'holding',
                      in: '$$holding.amount'
                    }
                  },
                  0
                ]
              },
              0
            ]
          },
          amount
        ]
      };
      update = [
        {
          $set: {
            usdtBalance: { $add: ['$usdtBalance', total] },
            holdings: {
              $filter: {
                input: {
                  $map: {
                    input: holdings,
                    as: 'holding',
                    in: {
                      $cond: [
                        { $eq: ['$$holding.coinId', coinId] },
                        { $mergeObjects: ['$$holding', { amount: { $subtract: ['$$holding.amount', amount] } }] },
                        '$$holding'
                      ]
                    }
                  }
                },
                as: 'holding',
                cond: { $gt: ['$$holding.amount', 0] }
              }
            },
            tradeHistory: {
              $slice: [
                { $concatArrays: [{ $ifNull: ['$tradeHistory', []] }, [trade]] },
                -500
              ]
            }
          }
        }
      ];
    }

    const wallet = await Wallet.findOneAndUpdate(filter, update, { new: true });
    if (!wallet) {
      return res.status(409).json({
        error: type === 'BUY'
          ? 'Insufficient USDT balance for this order.'
          : `Insufficient ${symbol} holdings for this order.`
      });
    }

    res.status(201).json({
      usdtBalance: wallet.usdtBalance,
      holdings: wallet.holdings,
      tradeHistory: [...wallet.tradeHistory].reverse(),
      bots: wallet.bots
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/portfolio/reset', authenticate, async (req, res, next) => {
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.userId },
      { $set: { usdtBalance: 10000, holdings: [], tradeHistory: [] } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({
      usdtBalance: wallet.usdtBalance,
      holdings: wallet.holdings,
      tradeHistory: [],
      bots: wallet.bots
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.patch('/portfolio/bots/:botId', authenticate, async (req, res, next) => {
  try {
    const { active } = req.body;
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'Bot active status must be true or false.' });
    }
    if (!DEFAULT_BOTS.some((bot) => bot.id === req.params.botId)) {
      return res.status(404).json({ error: 'Trading bot not found.' });
    }
    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.userId, 'bots.id': req.params.botId },
      { $set: { 'bots.$.active': active } },
      { new: true }
    );
    if (!wallet) return res.status(404).json({ error: 'Paper wallet not found.' });
    res.json({ bots: wallet.bots });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/watchlist', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('watchlist');
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    next(error);
  }
});

apiRouter.put('/watchlist', authenticate, async (req, res, next) => {
  try {
    const { watchlist } = req.body;
    if (
      !Array.isArray(watchlist) ||
      watchlist.length > 100 ||
      watchlist.some((coinId) => typeof coinId !== 'string' || !/^[a-z0-9-]{1,50}$/.test(coinId))
    ) {
      return res.status(400).json({ error: 'Watchlist must contain valid cryptocurrency IDs.' });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { watchlist: [...new Set(watchlist)] } },
      { new: true, runValidators: true }
    ).select('watchlist');
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/progress', authenticate, async (req, res, next) => {
  try {
    const { progress } = await ensureAccountData(req.userId);
    res.json({
      completedLessons: progress.completedLessons,
      quizResults: progress.quizResults
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.put('/progress', authenticate, async (req, res, next) => {
  try {
    const { completedLessons, quizResults } = req.body;
    if (
      !Array.isArray(completedLessons) ||
      completedLessons.length > 500 ||
      completedLessons.some((lessonId) => typeof lessonId !== 'string' || lessonId.length > 100) ||
      !quizResults ||
      typeof quizResults !== 'object' ||
      Array.isArray(quizResults) ||
      Object.keys(quizResults).length > 100
    ) {
      return res.status(400).json({ error: 'Invalid learning progress.' });
    }
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $set: { completedLessons: [...new Set(completedLessons)], quizResults } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({
      completedLessons: progress.completedLessons,
      quizResults: progress.quizResults
    });
  } catch (error) {
    next(error);
  }
});
