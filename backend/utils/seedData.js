import { User } from '../models/User.js';
import { Crypto } from '../models/Crypto.js';
import { Module } from '../models/Module.js';
import { News } from '../models/News.js';
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';

export const SEED_USERS = [
  {
    name: 'Farhan Ijaz',
    email: 'farhan@academic.edu',
    password: 'password123',
    studentId: '23L-0568',
    role: 'admin',
    riskTolerance: 'Moderate',
    balance: 10000.0,
    status: 'Active'
  },
  {
    name: 'Zain-ul-Abideen',
    email: 'zain@academic.edu',
    password: 'password123',
    studentId: '23L-0858',
    role: 'admin',
    riskTolerance: 'Moderate',
    balance: 10000.0,
    status: 'Active'
  },
  {
    name: 'Sarah Connor',
    email: 'student@academic.edu',
    password: 'password123',
    studentId: '23L-1120',
    role: 'student',
    riskTolerance: 'Conservative',
    balance: 8500.0,
    status: 'Active'
  },
  {
    name: 'Alex Rivera',
    email: 'trader@academic.edu',
    password: 'password123',
    studentId: '23L-0914',
    role: 'trader',
    riskTolerance: 'Aggressive',
    balance: 14200.0,
    status: 'Active'
  }
];

export const SEED_CRYPTOS = [
  {
    coinId: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'Layer 1',
    price: 68450.25,
    change24h: 3.42,
    change7d: 8.15,
    volume24h: 38240000000,
    marketCap: 1350000000000,
    circulatingSupply: '19,770,000 BTC',
    allTimeHigh: 73750.07,
    color: '#f7931a',
    rsi: 62.4,
    macd: 124.5,
    signal: 98.2,
    sma20: 66800.0,
    sma50: 64200.0,
    sma200: 59300.0,
    bollingerUpper: 71200.0,
    bollingerLower: 63500.0,
    aiSentiment: 82,
    aiPrediction: {
      trend: 'Strong Bullish',
      confidence: 89.4,
      target24h: 69800.0,
      target7d: 73200.0,
      target30d: 79500.0,
      target90d: 88000.0,
      upperBound7d: 75400.0,
      lowerBound7d: 70800.0,
      factors: [
        { name: 'Institutional Inflows (ETFs)', weight: '+38%', impact: 'positive' },
        { name: 'Hashrate & Miner Accumulation', weight: '+24%', impact: 'positive' },
        { name: 'Global Liquidity Index', weight: '+18%', impact: 'positive' },
        { name: 'Macro Interest Rate Uncertainty', weight: '-12%', impact: 'negative' }
      ]
    },
    history7d: [64200, 64900, 65800, 65400, 66700, 67200, 68450],
    history30d: [58900, 60100, 61400, 62800, 61900, 63400, 64200, 65800, 67200, 68450],
    predictionSeries7d: [68450, 69100, 69800, 71200, 71900, 72600, 73200],
    predictionUpper7d: [68450, 69700, 70900, 72800, 73800, 74700, 75400],
    predictionLower7d: [68450, 68200, 68900, 69900, 70200, 70600, 70800]
  },
  {
    coinId: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'Smart Contracts / L1',
    price: 3520.80,
    change24h: 2.15,
    change7d: 5.82,
    volume24h: 19840000000,
    marketCap: 423000000000,
    circulatingSupply: '120,070,000 ETH',
    allTimeHigh: 4891.70,
    color: '#627eea',
    rsi: 58.1,
    macd: 34.2,
    signal: 28.6,
    sma20: 3440.0,
    sma50: 3310.0,
    sma200: 3050.0,
    bollingerUpper: 3680.0,
    bollingerLower: 3260.0,
    aiSentiment: 76,
    aiPrediction: {
      trend: 'Bullish',
      confidence: 84.7,
      target24h: 3590.0,
      target7d: 3780.0,
      target30d: 4150.0,
      target90d: 4800.0,
      upperBound7d: 3920.0,
      lowerBound7d: 3620.0,
      factors: [
        { name: 'Layer-2 Gas Burn & Staking Ratio', weight: '+32%', impact: 'positive' },
        { name: 'DApp Developer Activity Growth', weight: '+26%', impact: 'positive' },
        { name: 'DeFi TVL Expansion', weight: '+21%', impact: 'positive' }
      ]
    },
    history7d: [3350, 3380, 3420, 3410, 3470, 3495, 3520.8],
    history30d: [3100, 3180, 3220, 3280, 3340, 3390, 3440, 3480, 3510, 3520.8],
    predictionSeries7d: [3520.8, 3560, 3610, 3670, 3710, 3750, 3780],
    predictionUpper7d: [3520.8, 3610, 3690, 3770, 3840, 3890, 3920],
    predictionLower7d: [3520.8, 3505, 3540, 3590, 3610, 3630, 3620]
  },
  {
    coinId: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    category: 'Layer 1',
    price: 182.40,
    change24h: 6.84,
    change7d: 14.20,
    volume24h: 8450000000,
    marketCap: 85200000000,
    circulatingSupply: '467,200,000 SOL',
    allTimeHigh: 260.06,
    color: '#14f195',
    rsi: 69.2,
    macd: 8.4,
    signal: 5.7,
    sma20: 168.0,
    sma50: 154.0,
    sma200: 132.0,
    bollingerUpper: 194.0,
    bollingerLower: 158.0,
    aiSentiment: 88,
    aiPrediction: {
      trend: 'Strong Bullish',
      confidence: 86.1,
      target24h: 191.0,
      target7d: 215.0,
      target30d: 250.0,
      target90d: 310.0,
      upperBound7d: 228.0,
      lowerBound7d: 202.0,
      factors: [
        { name: 'DEX Volume Dominance', weight: '+41%', impact: 'positive' },
        { name: 'Active Wallet Addresses Surge', weight: '+30%', impact: 'positive' }
      ]
    },
    history7d: [159, 162, 166, 171, 174, 177, 182.4],
    history30d: [138, 144, 150, 158, 162, 165, 170, 174, 178, 182.4],
    predictionSeries7d: [182.4, 187, 193, 199, 204, 210, 215],
    predictionUpper7d: [182.4, 192, 201, 210, 217, 224, 228],
    predictionLower7d: [182.4, 181, 186, 191, 195, 198, 202]
  }
];

export const SEED_MODULES = [
  {
    moduleId: 'blockchain-basics',
    title: 'Blockchain & Crypto Fundamentals',
    level: 'Beginner',
    readTime: '12 min',
    description: 'Understand the foundational technology powering cryptocurrencies, decentralized ledgers, consensus mechanisms, and cryptography.',
    lessons: [
      {
        id: 'lesson-1',
        title: 'What is a Distributed Ledger?',
        content: 'A distributed ledger is a decentralized database synchronized across multiple sites...',
        keyTakeaway: 'Blockchains replace blind trust in centralized third parties with verifiable cryptographic consensus.'
      },
      {
        id: 'lesson-2',
        title: 'Public vs Private Keys & Wallets',
        content: 'In cryptography, asymmetric key pairs safeguard your digital assets...',
        keyTakeaway: 'Always secure your 12 or 24-word recovery phrase offline. Anyone with the seed phrase controls all assets.'
      }
    ],
    quiz: {
      id: 'quiz-blockchain-basics',
      title: 'Blockchain Basics Mastery Quiz',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          question: 'What happens if you share your wallet seed phrase (private key) with someone?',
          options: [
            'They can only view your balance but cannot transfer coins',
            'They gain full irreversible control over your assets and can transfer them',
            'Your transactions will simply be delayed by 24 hours',
            'They are granted temporary read-only permissions'
          ],
          correctIndex: 1,
          explanation: 'Your private key/seed phrase signs transactions. Anyone holding it has unrestricted ownership of the assets.'
        }
      ]
    }
  }
];

export const SEED_BOTS = [
  {
    botId: 'rsi-mean-reversion',
    name: 'RSI Mean-Reversion Bot',
    description: 'Monitors 14-period RSI. Automatically buys simulated dips when RSI < 32 and sells when RSI > 68.',
    riskLevel: 'Moderate',
    targetPair: 'BTC/USDT',
    recommendedHorizon: 'Intraday (1H-4H)',
    winRate: '68.4%',
    tradesCount: 142,
    active: false,
    color: '#10b981'
  },
  {
    botId: 'ai-lstm-momentum',
    name: 'AI-LSTM Momentum Breakout',
    description: 'Triggers long positions when LSTM 24h forecasted price exceeds +2.5% with AI Confidence score > 85%.',
    riskLevel: 'Aggressive',
    targetPair: 'SOL/USDT',
    recommendedHorizon: 'Daily (24H)',
    winRate: '72.1%',
    tradesCount: 98,
    active: false,
    color: '#8b5cf6'
  }
];

export const SEED_NEWS = [
  {
    newsId: 'news-1',
    title: 'Global Institutional Inflows Push Bitcoin Past Key Resistance as Spot ETF Volumes Surge',
    source: 'CoinDesk Intelligence',
    time: '25 mins ago',
    category: 'Bitcoin / ETFs',
    sentiment: 'Positive',
    sentimentScore: 0.88,
    summary: 'Spot Bitcoin ETFs recorded a net inflow of $420M over 24 hours, driven by institutional treasury allocations and sustained retail buy orders.',
    impact: 'High Bullish',
    url: '#'
  },
  {
    newsId: 'news-2',
    title: 'Ethereum Layer-2 Network Gas Consumption Drops 85% Following Scalability Upgrade',
    source: 'DeFi Pulse',
    time: '1 hour ago',
    category: 'Ethereum / Layer 2',
    sentiment: 'Positive',
    sentimentScore: 0.76,
    summary: 'Blob transactions and rollup compression algorithms have reduced consumer gas fees to pennies, driving a record 4.8M daily active transactions across Arbitrum and Optimism.',
    impact: 'Moderate Bullish',
    url: '#'
  }
];

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Inserting initial academic users...');
      for (const u of SEED_USERS) {
        await User.create(u);
      }
    }

    const cryptoCount = await Crypto.countDocuments();
    if (cryptoCount === 0) {
      console.log('[Seed] Inserting initial crypto assets...');
      await Crypto.insertMany(SEED_CRYPTOS);
    }

    const moduleCount = await Module.countDocuments();
    if (moduleCount === 0) {
      console.log('[Seed] Inserting initial educational curriculum...');
      await Module.insertMany(SEED_MODULES);
    }

    const botCount = await Bot.countDocuments();
    if (botCount === 0) {
      console.log('[Seed] Inserting initial bot strategies...');
      await Bot.insertMany(SEED_BOTS);
    }

    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      console.log('[Seed] Inserting initial news & sentiment stories...');
      await News.insertMany(SEED_NEWS);
    }

    console.log('[Seed] Database initialization verified.');
  } catch (err) {
    console.warn(`[Seed Note] Auto-seeding skipped or already populated: ${err.message}`);
  }
};
