// Simulated Trading Bot Strategies and Default Configuration

export const BOT_STRATEGIES = [
  {
    id: 'rsi-mean-reversion',
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
    id: 'ai-lstm-momentum',
    name: 'AI-LSTM Momentum Breakout',
    description: 'Triggers long positions when LSTM 24h forecasted price exceeds +2.5% with AI Confidence score > 85%.',
    riskLevel: 'Aggressive',
    targetPair: 'SOL/USDT',
    recommendedHorizon: 'Daily (24H)',
    winRate: '72.1%',
    tradesCount: 98,
    active: false,
    color: '#8b5cf6'
  },
  {
    id: 'dca-accumulator',
    name: 'Dollar Cost Averaging (DCA)',
    description: 'Executes simulated fixed-amount purchases periodically regardless of market volatility to smooth entry price.',
    riskLevel: 'Conservative',
    targetPair: 'ETH/USDT',
    recommendedHorizon: 'Weekly / Long-Term',
    winRate: '84.0%',
    tradesCount: 210,
    active: false,
    color: '#3b82f6'
  },
  {
    id: 'grid-volatility-bot',
    name: 'Grid Trading Range Bot',
    description: 'Places geometric buy and sell grid limit orders within a defined support-resistance channel to capture sideways chop.',
    riskLevel: 'Moderate',
    targetPair: 'AVAX/USDT',
    recommendedHorizon: 'Sideways / Consolidation',
    winRate: '70.5%',
    tradesCount: 340,
    active: false,
    color: '#f59e0b'
  }
];

export const INITIAL_PAPER_WALLET = {
  usdtBalance: 10000.0, // Starting virtual balance
  holdings: [
    { coinId: 'bitcoin', symbol: 'BTC', amount: 0.08, avgBuyPrice: 65200.0 },
    { coinId: 'ethereum', symbol: 'ETH', amount: 0.95, avgBuyPrice: 3380.0 },
    { coinId: 'solana', symbol: 'SOL', amount: 6.5, avgBuyPrice: 165.0 }
  ],
  tradeHistory: [
    {
      id: 'tx-init-1',
      type: 'BUY',
      symbol: 'BTC',
      amount: 0.08,
      price: 65200.0,
      total: 5216.0,
      timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      status: 'FILLED',
      orderType: 'MARKET',
      strategy: 'Manual'
    },
 
  ]
};
