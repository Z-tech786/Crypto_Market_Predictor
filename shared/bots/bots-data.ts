export interface Bot {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  priceUSD: number
  monthlyRental?: number
  icon: string
  performance: string
  risk: 'Low' | 'Medium' | 'High'
  minInvestment: number
  timeframe: string
  pairs: string[]
  features: string[]
  mql5File: string
  version: string
  lastUpdated: string
  requirements: string
  popular?: boolean
  category: 'scalping' | 'trend' | 'arbitrage' | 'grid' | 'ml' | 'dca'
  exchange: 'MT5' | 'MT4' | 'Both'
}

export const bots: Bot[] = [
  {
    id: 'scalper-pro',
    name: 'Scalper Pro EA',
    description: 'High-frequency scalping bot for MQL5. Executes 50-100 trades daily.',
    longDescription: 'Professional scalping Expert Advisor designed for M5-M15 timeframes. Uses advanced order flow analysis and market microstructure to capture small price movements with high win rate.',
    price: 499,
    priceUSD: 499,
    monthlyRental: 49,
    icon: 'Zap',
    performance: '+45.2% monthly',
    risk: 'High',
    minInvestment: 1000,
    timeframe: 'M5-M15',
    pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD'],
    features: [
      'Fully automated trading',
      'Smart entry/exit algorithms',
      'Dynamic stop-loss (ATR based)',
      'News filter',
      'Money management system',
      'Works on 28 currency pairs'
    ],
    mql5File: '/bots/mql5/scalper-pro.ex5',
    version: '2.4.1',
    lastUpdated: '2024-02-15',
    requirements: 'MT5 platform, VPS recommended',
    popular: true,
    category: 'scalping',
    exchange: 'MT5'
  },
  {
    id: 'trend-follower',
    name: 'Trend Follower Pro',
    description: 'Multi-timeframe trend trading system with ML confirmation.',
    longDescription: 'Advanced trend following EA that combines moving averages, MACD, and machine learning to identify and ride strong trends. Perfect for H1-H4 timeframes.',
    price: 299,
    priceUSD: 299,
    monthlyRental: 29,
    icon: 'TrendingUp',
    performance: '+32.8% monthly',
    risk: 'Medium',
    minInvestment: 500,
    timeframe: 'H1-H4',
    pairs: ['BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'AUDUSD'],
    features: [
      'ML trend confirmation',
      'Multi-timeframe analysis',
      'Trailing stop with breakeven',
      'Position sizing calculator',
      'Drawdown control',
      'Works on 15+ pairs'
    ],
    mql5File: '/bots/mql5/trend-follower.ex5',
    version: '3.1.0',
    lastUpdated: '2024-02-10',
    requirements: 'MT5 platform, basic knowledge',
    popular: false,
    category: 'trend',
    exchange: 'Both'
  },
  {
    id: 'arbitrage-hunter',
    name: 'Arbitrage Hunter',
    description: 'Cross-exchange arbitrage bot for MQL5. Low risk, steady returns.',
    longDescription: 'Scans multiple brokers in real-time to find and execute arbitrage opportunities. Includes latency compensation and smart order routing.',
    price: 799,
    priceUSD: 799,
    monthlyRental: 79,
    icon: 'Activity',
    performance: '+18.5% monthly',
    risk: 'Low',
    minInvestment: 2000,
    timeframe: 'Real-time',
    pairs: ['All major pairs'],
    features: [
      '10+ broker support',
      'Cross-exchange routing',
      'Minimum latency (<50ms)',
      'Auto profit calculation',
      'Risk limits',
      'Trade journal'
    ],
    mql5File: '/bots/mql5/arbitrage-hunter.ex5',
    version: '1.8.3',
    lastUpdated: '2024-02-01',
    requirements: 'Multiple MT5 accounts, VPS',
    popular: false,
    category: 'arbitrage',
    exchange: 'MT5'
  },
  {
    id: 'grid-trader',
    name: 'Grid Trader Elite',
    description: 'Intelligent grid trading system for ranging markets.',
    longDescription: 'Automated grid trading EA with dynamic grid adjustment, smart recovery system, and multiple exit strategies. Perfect for sideways markets.',
    price: 199,
    priceUSD: 199,
    monthlyRental: 19,
    icon: 'BarChart3',
    performance: '+23.4% monthly',
    risk: 'Low',
    minInvestment: 500,
    timeframe: 'M15-H1',
    pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'],
    features: [
      'Dynamic grid levels',
      'Auto grid adjustment',
      'Martingale recovery (optional)',
      'Take-profit targets',
      'Drawdown limiter',
      'Works on all pairs'
    ],
    mql5File: '/bots/mql5/grid-trader.ex5',
    version: '2.2.5',
    lastUpdated: '2024-02-05',
    requirements: 'MT4/MT5, basic understanding',
    popular: true,
    category: 'grid',
    exchange: 'Both'
  },
  {
    id: 'ml-predictor',
    name: 'ML Predictor EA',
    description: 'Machine learning EA with 94% prediction accuracy.',
    longDescription: 'Cutting-edge Expert Advisor using ensemble of LSTM, Transformer, and XGBoost models trained on 10+ years of data. Includes sentiment analysis and on-chain metrics.',
    price: 999,
    priceUSD: 999,
    monthlyRental: 99,
    icon: 'Brain',
    performance: '+67.8% monthly',
    risk: 'High',
    minInvestment: 5000,
    timeframe: 'H1-D1',
    pairs: ['BTCUSD', 'ETHUSD', 'XAUUSD'],
    features: [
      'Ensemble ML models (94% accuracy)',
      'Real-time sentiment analysis',
      'On-chain metrics integration',
      'Risk scoring system',
      'Auto model retraining',
      'Cloud-based predictions'
    ],
    mql5File: '/bots/mql5/ml-predictor.ex5',
    version: '1.5.2',
    lastUpdated: '2024-02-18',
    requirements: 'MT5, API access, advanced knowledge',
    popular: true,
    category: 'ml',
    exchange: 'MT5'
  },
  {
    id: 'dca-bot',
    name: 'DCA Wizard',
    description: 'Smart dollar-cost averaging bot for long-term investors.',
    longDescription: 'Automated DCA EA with smart entry points, dip-buying strategy, and take-profit automation. Perfect for building long-term positions.',
    price: 99,
    priceUSD: 99,
    monthlyRental: 9,
    icon: 'DollarSign',
    performance: '+15.2% yearly',
    risk: 'Low',
    minInvestment: 100,
    timeframe: 'Daily/Weekly',
    pairs: ['BTCUSD', 'ETHUSD', 'XAUUSD', 'All crypto'],
    features: [
      'Custom intervals (daily/weekly/monthly)',
      'Dip-buying strategy',
      'Take-profit automation',
      'Portfolio rebalancing',
      'Multiple entry strategies',
      'Works on any symbol'
    ],
    mql5File: '/bots/mql5/dca-wizard.ex5',
    version: '1.2.0',
    lastUpdated: '2024-02-12',
    requirements: 'No experience needed',
    popular: false,
    category: 'dca',
    exchange: 'Both'
  }
]
