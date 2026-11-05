// News and Sentiment Analysis data

export const NEWS_ARTICLES = [
  {
    id: 'news-1',
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
    id: 'news-2',
    title: 'Ethereum Layer-2 Network Gas Consumption Drops 85% Following Scalability Upgrade',
    source: 'DeFi Pulse',
    time: '1 hour ago',
    category: 'Ethereum / Layer 2',
    sentiment: 'Positive',
    sentimentScore: 0.76,
    summary: 'Blob transactions and rollup compression algorithms have reduced consumer gas fees to pennies, driving a record 4.8M daily active transactions across Arbitrum and Optimism.',
    impact: 'Moderate Bullish',
    url: '#'
  },
  {
    id: 'news-3',
    title: 'Federal Reserve Signals Measured Stance on Rate Cuts Amid Sticky Inflation Prints',
    source: 'Macro Market Watch',
    time: '3 hours ago',
    category: 'Macroeconomics',
    sentiment: 'Neutral',
    sentimentScore: 0.05,
    summary: 'Central bankers reaffirmed data-dependent monetary posture. High-risk digital assets experienced brief intraday volatility before reclaiming weekly support levels.',
    impact: 'Neutral / Consolidation',
    url: '#'
  },
  {
    id: 'news-4',
    title: 'Solana Ecosystem DEX Volume Overtakes Competitors Amid Memecoin and DeFi Liquidity Rush',
    source: 'Blockworks Research',
    time: '5 hours ago',
    category: 'Solana / DEX',
    sentiment: 'Positive',
    sentimentScore: 0.82,
    summary: 'Raydium and Orca reported a combined $3.2B in 24-hour decentralized exchange volume, propelled by ultra-fast finality and deep liquidity pools.',
    impact: 'High Bullish',
    url: '#'
  },
  {
    id: 'news-5',
    title: 'Regulatory Regulatory Clarifications Provide Framework for Stablecoin Yield Distribution',
    source: 'CryptoPolicy Today',
    time: '7 hours ago',
    category: 'Regulation',
    sentiment: 'Neutral',
    sentimentScore: 0.15,
    summary: 'Lawmakers in key international jurisdictions introduced bipartisan guidelines for bank-issued digital payment tokens and licensed custody standards.',
    impact: 'Neutral / Long-term Bullish',
    url: '#'
  },
  {
    id: 'news-6',
    title: 'Security Notice: Phishing Campaign Targets Unsuspecting Users via Malicious Browser Extensions',
    source: 'ChainSec Alerts',
    time: '10 hours ago',
    category: 'Security / Alert',
    sentiment: 'Negative',
    sentimentScore: -0.68,
    summary: 'Security researchers identified fake wallet popups seeking seed phrases. Users are urged to verify official extension hashes and employ hardware wallet signing.',
    impact: 'Cautionary / Security',
    url: '#'
  }
];

export const SENTIMENT_METRICS = {
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
    exchangeNetInflow: '-14,250 BTC (Outflow from exchanges into cold storage)',
    interpretation: 'Strong Accumulation Phase'
  }
};
