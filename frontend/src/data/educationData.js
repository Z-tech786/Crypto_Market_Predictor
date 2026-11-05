// Educational curriculum: Lessons, Flashcards, and Interactive Quizzes

export const EDUCATION_MODULES = [
  {
    id: 'blockchain-basics',
    title: 'Blockchain & Crypto Fundamentals',
    level: 'Beginner',
    readTime: '12 min',
    description: 'Understand the foundational technology powering cryptocurrencies, decentralized ledgers, consensus mechanisms, and cryptography.',
    lessons: [
      {
        id: 'lesson-1',
        title: 'What is a Distributed Ledger?',
        content: `A distributed ledger is a decentralized database synchronized and accessible across multiple sites and participants without the need for a central administrator or intermediary.
        
Key Concepts:
• Immutability: Once a transaction block is cryptographically linked to previous blocks via cryptographic hashes (SHA-256), modifying past data requires re-mining all subsequent blocks.
• Consensus: Nodes on the network agree on valid states using algorithmic protocols like Proof of Work (PoW) or Proof of Stake (PoS).
• Transparency: Every participant can inspect transactions on a public blockchain explorer while identities remain pseudonymous behind public wallet addresses.`,
        keyTakeaway: 'Blockchains replace blind trust in centralized third parties with verifiable cryptographic consensus.'
      },
      {
        id: 'lesson-2',
        title: 'Public vs Private Keys & Wallets',
        content: `In cryptography, asymmetric key pairs safeguard your digital assets:
        
• Public Key: Similar to your bank account IBAN or email address. You share it publicly to receive funds.
• Private Key: Similar to your secret password or PIN. It cryptographically signs outgoing transactions. Never share your private key or seed phrase with anyone!
• Non-Custodial Wallets: You own the keys (e.g. MetaMask, Hardware Ledger). If lost, funds cannot be recovered by customer support.
• Custodial Exchanges: The platform holds your private keys on your behalf. "Not your keys, not your coins."`,
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
        },
        {
          id: 'q2',
          question: 'What ensures that historical blocks in a blockchain cannot be easily tampered with?',
          options: [
            'A centralized legal agreement between miners',
            'Cryptographic hashing where each block references the previous hash',
            'Government server encryption backups',
            'Local browser cookie storage'
          ],
          correctIndex: 1,
          explanation: 'Each block contains the hash of the preceding block. Changing past data breaks the cryptographic hash chain.'
        },
        {
          id: 'q3',
          question: 'What does "Not your keys, not your coins" refer to in cryptocurrency?',
          options: [
            'Only storing coins in cold storage paper wallets is legally recognized',
            'If an exchange holds your private keys, you depend entirely on their solvency and policies',
            'Physical metal keys must be inserted into computers to sign crypto transfers',
            'You must register your government ID with every blockchain transaction'
          ],
          correctIndex: 1,
          explanation: 'Custodial exchanges hold your private keys. If the exchange halts withdrawals or becomes insolvent, you do not directly hold the assets.'
        }
      ]
    }
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis & Indicators',
    level: 'Intermediate',
    readTime: '18 min',
    description: 'Learn how to read candlestick charts, identify trend reversals, and apply RSI, MACD, and Bollinger Bands.',
    lessons: [
      {
        id: 'lesson-ta-1',
        title: 'Candlestick Anatomy & Price Action',
        content: `A candlestick represents price movement across a specific timeframe (e.g., 15m, 1h, 1D).
        
• Body: The area between the Open and Close price. A green body means Close > Open; a red body means Close < Open.
• Wicks/Shadows: The thin lines extending above and below show the High and Low prices achieved during the timeframe.
• Support & Resistance: Support is a price level where buying interest is strong enough to overcome selling pressure. Resistance is a ceiling where selling pressure halts upwards price momentum.`,
        keyTakeaway: 'Long wicks at support levels indicate rejection of lower prices and strong buyer interest.'
      },
      {
        id: 'lesson-ta-2',
        title: 'Mastering RSI, MACD & Bollinger Bands',
        content: `Momentum and volatility indicators provide quantitative context to price charts:
        
1. Relative Strength Index (RSI):
• Measures speed and change of price moves on a 0–100 scale.
• RSI > 70 is traditionally considered "Overbought" (potential pullback or consolidation).
• RSI < 30 is considered "Oversold" (potential rebound or bargain buying).

2. Moving Average Convergence Divergence (MACD):
• Consists of the MACD line (12 EMA - 26 EMA) and the 9 EMA Signal line.
• Bullish Crossover: MACD line crosses above the Signal line.
• Bearish Crossover: MACD line crosses below the Signal line.

3. Bollinger Bands:
• Plotted at 2 standard deviations away from a 20-day simple moving average.
• Price touching upper band indicates high volatility/stretch; band squeezes precede major explosive breakouts.`,
        keyTakeaway: 'No single indicator guarantees direction; combining trend analysis with RSI and volume yields higher accuracy.'
      }
    ],
    quiz: {
      id: 'quiz-technical-analysis',
      title: 'Technical Analysis Proficiency Quiz',
      passingScore: 70,
      questions: [
        {
          id: 'qta1',
          question: 'An RSI value reading above 70 on a daily chart generally indicates which market condition?',
          options: [
            'The market is deeply oversold and likely to drop much further',
            'The asset is in overbought territory and may experience consolidation or pullback',
            'Trading volume is zero and markets are frozen',
            'A hardfork split is occurring on the blockchain'
          ],
          correctIndex: 1,
          explanation: 'RSI values above 70 signify aggressive upward momentum that may be extended or overbought in the short term.'
        },
        {
          id: 'qta2',
          question: 'What is a "Bullish MACD Crossover"?',
          options: [
            'The MACD line crosses below the zero line',
            'The MACD line crosses above the Signal line',
            'Trading volume decreases below the 50-day average',
            'Price falls below the 200-day simple moving average'
          ],
          correctIndex: 1,
          explanation: 'When the faster MACD line cuts upwards across the slower 9-period Signal line, it signals growing upward momentum.'
        },
        {
          id: 'qta3',
          question: 'What typically follows a prolonged "Bollinger Band Squeeze" where bands become very narrow?',
          options: [
            'Perpetual flat price movement forever',
            'An explosive volatility breakout in either upward or downward direction',
            'Automatic delisting of the coin',
            'Halving of the circulating token supply'
          ],
          correctIndex: 1,
          explanation: 'Bollinger Band contractions reflect low volatility compression, which is historically followed by sharp, explosive expansion.'
        }
      ]
    }
  },
  {
    id: 'ai-trading-models',
    title: 'AI & Machine Learning in Crypto Trading',
    level: 'Advanced',
    readTime: '20 min',
    description: 'Explore how deep learning, LSTM networks, transformers, and sentiment analysis generate predictive market forecasts.',
    lessons: [
      {
        id: 'lesson-ai-1',
        title: 'Long Short-Term Memory (LSTM) & Time Series',
        content: `Financial price action is sequential time-series data with non-linear dependencies.
        
• Why LSTMs?: Standard Recurrent Neural Networks (RNNs) suffer from vanishing gradients over long horizons. LSTMs utilize memory cells, forget gates, and input gates to retain long-range temporal trends while filtering high-frequency noise.
• Multi-Feature Inputs: Rather than just closing prices, modern models ingest OHLCV data, order book depth, on-chain active addresses, funding rates, and social sentiment vectors.
• Uncertainty Bands: Reliable AI models never provide single static price points; they generate Bayesian confidence intervals (e.g. 95% CI) reflecting market entropy.`,
        keyTakeaway: 'AI models forecast statistical probabilities, not certainties. Risk management must always accompany automated strategies.'
      },
      {
        id: 'lesson-ai-2',
        title: 'Paper Trading & Algorithmic Strategy Backtesting',
        content: `Before deploying trading algorithms with real capital, quantitative researchers conduct rigorous simulation:
        
• Paper Trading: Real-time simulation where orders execute against live market data feeds without financial risk.
• Slippage & Fee Modeling: Realistic simulations account for exchange maker/taker fees (e.g. 0.1%) and liquidity spread.
• Maximum Drawdown: The peak-to-trough decline of a portfolio. A strategy with high win rate but 70% drawdown poses catastrophic liquidation risk.`,
        keyTakeaway: 'Always evaluate an algorithmic strategy by its Sharpe Ratio and Max Drawdown, not just gross returns.'
      }
    ],
    quiz: {
      id: 'quiz-ai-trading',
      title: 'AI Trading & Quantitative Forecasting Quiz',
      passingScore: 70,
      questions: [
        {
          id: 'qai1',
          question: 'Why are LSTM (Long Short-Term Memory) neural networks favored over basic RNNs for crypto time-series?',
          options: [
            'LSTMs only work with Bitcoin and reject other coins',
            'LSTMs overcome the vanishing gradient problem to capture long-term sequential dependencies',
            'LSTMs do not require historical training data',
            'LSTMs can predict future prices with 100% guaranteed certainty'
          ],
          correctIndex: 1,
          explanation: 'LSTMs use gated memory cells that allow gradients to flow across many time steps without exponential decay.'
        },
        {
          id: 'qai2',
          question: 'What is the purpose of displaying upper and lower Confidence Interval (CI) bands in AI forecasts?',
          options: [
            'To hide that the model has crashed',
            'To express statistical uncertainty and volatility dispersion rather than a single deterministic number',
            'To show the minimum and maximum gas fees on Ethereum',
            'To indicate the exchange server reboot times'
          ],
          correctIndex: 1,
          explanation: 'Financial markets are stochastic and non-stationary. Confidence intervals depict the statistical variance and risk envelope of the forecast.'
        },
        {
          id: 'qai3',
          question: 'What is "Paper Trading" in cryptocurrency systems?',
          options: [
            'Trading certificates printed on physical sheets of paper',
            'Simulated risk-free trading using virtual balances on live or simulated market prices',
            'Submitting paper documents to banking regulators',
            'Buying physical shares of paper manufacturing corporations'
          ],
          correctIndex: 1,
          explanation: 'Paper trading allows traders and students to practice execution, test bot strategies, and understand P&L without real-money losses.'
        }
      ]
    }
  }
];
