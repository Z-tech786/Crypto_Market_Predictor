// Comprehensive Crypto Education Curriculum: Standard Courses, Lessons, Quizzes & Faculty

export const FACULTY_MEMBERS = [
  {
    id: 'tariq-mahmood',
    name: 'Prof. Dr. Tariq Mahmood',
    title: 'Professor & Head of Distributed Systems',
    department: 'Department of Computer Science • FAST NUCES',
    avatar: 'TM',
    color: '#06b6d4',
    qualification: 'Ph.D. in Distributed Systems & Cryptographic Protocols',
    specialization: ['Consensus Algorithms', 'Byzantine Fault Tolerance', 'Zero-Knowledge Proofs', 'Cryptographic Primitives'],
    officeHours: 'Mon & Wed: 02:00 PM – 04:00 PM (CS Faculty Wing, Room 304)',
    email: 'tariq.mahmood@nu.edu.pk',
    bio: 'Pioneering researcher in distributed state-machine replication and peer-to-peer cryptographic consensus. Over 18 years of academic instruction guiding undergraduate and graduate researchers in decentralized computing.'
  },
  {
    id: 'farhan-ijaz',
    name: 'Engr. Farhan Ijaz (23L-0568)',
    title: 'Lead Instructor — AI & Backend Architecture',
    department: 'Web Programming & Intelligent Systems • FAST NUCES',
    avatar: 'FI',
    color: '#3b82f6',
    qualification: 'B.S. Computer Science • Full-Stack Systems Specialist',
    specialization: ['PyTorch LSTM Networks', 'RESTful Microservices', 'MongoDB High-Throughput Pipelines', 'Bayesian Envelopes'],
    officeHours: 'Tue & Thu: 11:00 AM – 01:00 PM (Lab 7)',
    email: 'l230568@lhr.nu.edu.pk',
    bio: 'Lead architect of the NeuroCrypto backend and predictive model pipelines. Specializes in building asynchronous numerical time-series pipelines and containerized deep learning microservices.'
  },
  {
    id: 'zain-ul-abideen',
    name: 'Engr. Zain-ul-Abideen (23L-0858)',
    title: 'Lead Instructor — Quantitative Trading & MQL5',
    department: 'Algorithmic Financial Engineering • FAST NUCES',
    avatar: 'ZA',
    color: '#a855f7',
    qualification: 'B.S. Computer Science • Algorithmic Trading Developer',
    specialization: ['MetaTrader 5 MQL5 EAs', 'Paper Trading Simulators', 'React 19 Fintech UI/UX', 'Order Execution Engines'],
    officeHours: 'Fri: 10:00 AM – 12:30 PM (Lab 3)',
    email: 'l230858@lhr.nu.edu.pk',
    bio: 'Developer of the 4 autonomous quantitative trading bots and custom MetaTrader 5 Expert Advisors. Passionate about educational gamification, risk-free market simulation, and algorithmic discipline.'
  },
  {
    id: 'sarah-jenkins',
    name: 'Dr. Sarah Jenkins, CFA',
    title: 'Visiting Professor of Quantitative Risk & Portfolio Theory',
    department: 'Global FinTech Institute & Visiting Faculty',
    avatar: 'SJ',
    color: '#10b981',
    qualification: 'Ph.D. in Computational Finance • Chartered Financial Analyst (CFA)',
    specialization: ['Position Sizing Formulas', 'Kelly Criterion', 'Value-at-Risk (VaR)', 'Behavioral Finance'],
    officeHours: 'Virtual Consultation via Academic Portal',
    email: 's.jenkins@fintech-academic.org',
    bio: 'Over a decade of quantitative risk analysis across volatile digital asset classes. Specializes in mathematically proven drawdown containment and multi-factor portfolio optimization.'
  }
];

export const EDUCATION_MODULES = [
  {
    id: 'blockchain-basics',
    title: 'Course 1: Blockchain Architecture, Consensus & Cryptography',
    shortTitle: 'Blockchain & Cryptography',
    level: 'Beginner',
    readTime: '15 min',
    instructor: 'Prof. Dr. Tariq Mahmood',
    description: 'Master the foundational mechanics of decentralized ledgers, cryptographic hashing, asymmetric key security, and consensus algorithms.',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Distributed Ledgers & SHA-256 Hashing',
        content: `A distributed ledger is a decentralized, cryptographically linked database synchronized across thousands of independent nodes without a centralized administrator.

Core Architectural Building Blocks:
• Cryptographic Hash Function (SHA-256): A mathematical algorithm that takes any input data and converts it into a deterministic 256-bit (64-character hexadecimal) string. Any minuscule alteration to the input changes the resulting hash completely (the avalanche effect).
• Block Linking: Each block records transactions alongside the hash of the preceding block (parent hash). Modifying past records would invalidate every subsequent block's hash, making the ledger computationally immutable.
• Peer-to-Peer Gossiping: Nodes broadcast verified transactions across the network using a peer-to-peer gossip protocol, ensuring fault-tolerant state synchronization.`,
        keyTakeaway: 'Cryptographic hash chains replace blind trust in centralized banks with verifiable, immutable mathematics.'
      },
      {
        id: 'lesson-2',
        title: 'Asymmetric Key Cryptography & Wallet Custody',
        content: `Cryptocurrencies do not store coins inside physical devices or local folders. Wallets simply store the cryptographic keys that prove ownership of unspent coins on the public blockchain:

• Public Key: Generated from the private key via Elliptic Curve Cryptography (secp256k1). It is hashed to create your public wallet address (e.g. 0x... or bc1...), which you freely share to receive funds.
• Private Key: A secret 256-bit integer used to generate digital signatures (ECDSA/Schnorr) that authorize and sign outgoing transfers.
• Seed Recovery Phrase: A human-readable 12 or 24-word phrase (BIP-39 standard) that deterministically derives all private keys and sub-addresses.
• Custodial vs Non-Custodial: On centralized exchanges, the exchange holds the master private keys ("Not your keys, not your coins"). In non-custodial self-storage, you retain absolute sovereign custody.`,
        keyTakeaway: 'Never store your 12/24-word seed phrase digitally or share it. Possession of the private key confers irreversible ownership of the funds.'
      },
      {
        id: 'lesson-3',
        title: 'Consensus Engines: Proof of Work vs Proof of Stake',
        content: `Distributed networks must achieve consensus on the single source of truth without trusting any single coordinator:

• Proof of Work (PoW): Miners expend computational electricity running billions of SHA-256 hash calculations per second until discovering a hash below the network's target difficulty. PoW guarantees thermodynamic security and mathematical finality (used by Bitcoin).
• Proof of Stake (PoS): Network validators stake native tokens (e.g., 32 ETH) into a smart contract to earn the right to propose and attest to new blocks. Dishonest or offline behavior results in financial slashing penalties, reducing energy consumption by 99.95%.`,
        keyTakeaway: 'Proof of Work secures consensus through computational energy; Proof of Stake achieves it through bonded capital incentives.'
      }
    ],
    quiz: {
      id: 'quiz-blockchain-basics',
      title: 'Blockchain Architecture & Cryptography Certification Quiz',
      passingScore: 75,
      questions: [
        {
          id: 'q1',
          question: 'What happens if you disclose your 12-word wallet seed phrase to an unverified third party?',
          options: [
            'They can inspect your transaction history but cannot transfer funds',
            'They gain unrestricted, irreversible authorization to spend and transfer all your wallet assets',
            'Your transactions are put on temporary 48-hour administrative hold',
            'They can only claim staking yields but not principal'
          ],
          correctIndex: 1,
          explanation: 'The BIP-39 seed phrase deterministically generates your private signing keys. Anyone holding it has full sovereign control of your funds.'
        },
        {
          id: 'q2',
          question: 'Why is modifying a historical transaction in an established blockchain computationally infeasible?',
          options: [
            'Government database regulations automatically revert unauthorized edits',
            'Every subsequent block stores the cryptographic hash of the preceding block, requiring the recalculation of all subsequent proof-of-work hashes',
            'Mining nodes shut down automatically when data is changed',
            'All transactions are held inside local browser cookie caches'
          ],
          correctIndex: 1,
          explanation: 'Because each block embeds the SHA-256 hash of its predecessor, altering historical data breaks the entire cryptographic chain across all subsequent blocks.'
        },
        {
          id: 'q3',
          question: 'In Proof of Stake (PoS) blockchains like Ethereum, what prevents validators from proposing fraudulent transactions?',
          options: [
            'Legal contracts signed with international securities regulators',
            'Slashing mechanisms that automatically burn or seize a portion of the validator\'s locked staked capital',
            'The requirement to solve complex mathematical energy equations',
            'Only government-approved banking institutions are permitted to act as validators'
          ],
          correctIndex: 1,
          explanation: 'Proof of Stake secures honest validation through economic penalties ("slashing"), destroying a validator\'s staked collateral if they double-sign or propose invalid blocks.'
        },
        {
          id: 'q4',
          question: 'What is the relationship between a private key and a public wallet address?',
          options: [
            'The private key is derived from the public address through reverse encryption',
            'The public address is cryptographically derived from the private key via one-way Elliptic Curve Cryptography',
            'They are identical values generated by the blockchain exchange',
            'They must both be publicly shared to receive incoming transfers'
          ],
          correctIndex: 1,
          explanation: 'Elliptic Curve Cryptography is a one-way trapdoor function: you can easily compute the public key/address from the private key, but reversing the process is computationally impossible.'
        }
      ]
    }
  },
  {
    id: 'technical-analysis',
    title: 'Course 2: Technical Analysis, Candlestick Dynamics & Key Indicators',
    shortTitle: 'Technical Analysis & Indicators',
    level: 'Beginner',
    readTime: '20 min',
    instructor: 'Engr. Zain-ul-Abideen',
    description: 'Learn institutional candlestick anatomy, support/resistance mechanics, moving averages, RSI, MACD, and Bollinger Bands.',
    lessons: [
      {
        id: 'lesson-ta-1',
        title: 'Candlestick Anatomy & Support/Resistance Framework',
        content: `Japanese candlesticks visualize the perpetual auction between buyers (bulls) and sellers (bears):

• Body & Wicks: The solid body spans between the Open and Close. Upper and lower wicks (shadows) pinpoint the absolute High and Low price extremes during the interval.
• Long Lower Wicks ("Hammer / Pinbar"): Signify aggressive buyer defense and demand rejection at lower price zones.
• Support & Resistance Zones:
  - Support: A price floor where concentrated buy limit orders absorb aggressive market selling.
  - Resistance: A price ceiling where concentrated profit-taking and sell limit orders exhaust buying momentum.
• Polarity Flip: When an established resistance level is decisively broken with elevated volume, it frequently retests as a new support level.`,
        keyTakeaway: 'Always treat support and resistance as dynamic zones rather than single razor-thin price points.'
      },
      {
        id: 'lesson-ta-2',
        title: 'Momentum Oscillators: The Relative Strength Index (RSI)',
        content: `The Relative Strength Index (RSI) is a bounded momentum oscillator operating between 0 and 100:

Mathematical Definition:
RSI = 100 - [100 / (1 + RS)], where RS is the exponential ratio of average upward price gains to downward losses over 14 periods.

Trading Applications:
• Overbought Territory (> 70): Suggests rapid upward euphoria. While strong trends can remain overbought for extended periods, it flags an elevated risk of short-term consolidation.
• Oversold Territory (< 30): Suggests severe liquidation and panic selling, frequently marking asymmetric risk-reward dip buying zones.
• Bullish Divergence: Occurs when price makes a lower low while the RSI indicator forms a higher low, indicating diminishing downward momentum and an impending reversal.`,
        keyTakeaway: 'RSI divergences provide leading reversal warnings that often precede breakout price moves.'
      },
      {
        id: 'lesson-ta-3',
        title: 'Trend Indicators: Moving Averages & MACD Crossovers',
        content: `Trend indicators smooth out high-frequency noise to illuminate directional market momentum:

• Simple Moving Average (SMA) vs Exponential Moving Average (EMA): The 20, 50, and 200-day moving averages act as institutional baseline trend filters.
• Golden Cross vs Death Cross:
  - Golden Cross: The 50-day moving average crosses above the 200-day moving average, confirming a macro bullish expansion phase.
  - Death Cross: The 50-day moving average cuts below the 200-day moving average, signaling prolonged bear market headwinds.
• MACD (Moving Average Convergence Divergence):
  - MACD Line = 12 EMA - 26 EMA
  - Signal Line = 9 EMA of the MACD Line
  - Bullish Signal: MACD Line crosses above the Signal Line accompanied by expanding green histogram bars.`,
        keyTakeaway: 'Never trade an indicator in isolation. Confluence between MACD, RSI, and support levels yields the highest probability setups.'
      }
    ],
    quiz: {
      id: 'quiz-technical-analysis',
      title: 'Technical Analysis Mastery Quiz',
      passingScore: 75,
      questions: [
        {
          id: 'qta1',
          question: 'What is a "Bullish RSI Divergence"?',
          options: [
            'Price makes a higher high while RSI reaches 100',
            'Price prints a lower low while the RSI indicator prints a higher low',
            'RSI drops to exactly zero for three consecutive candles',
            'Volume drops below the 200-day moving average'
          ],
          correctIndex: 1,
          explanation: 'Bullish divergence occurs when downward price momentum exhausts, causing the oscillator to register a higher low even as spot price dips to a fresh low.'
        },
        {
          id: 'qta2',
          question: 'What classic pattern occurs when the 50-day Moving Average crosses ABOVE the 200-day Moving Average?',
          options: [
            'A Death Cross',
            'A Golden Cross',
            'A Bollinger Band Squeeze',
            'An Impermanent Loss Event'
          ],
          correctIndex: 1,
          explanation: 'A Golden Cross is an institutional long-term bullish signal indicating that medium-term momentum has overtaken the long-term trend.'
        },
        {
          id: 'qta3',
          question: 'What does a prolonged "Bollinger Band Squeeze" indicate?',
          options: [
            'The asset is being permanently delisted from exchanges',
            'Market volatility has compressed to extreme lows, typically preceding an explosive directional expansion',
            'All smart contracts on the blockchain have paused execution',
            'Mining rewards have halved'
          ],
          correctIndex: 1,
          explanation: 'Volatility is cyclical. Severe contraction in the distance between upper and lower Bollinger Bands historically precedes massive explosive price breakouts.'
        },
        {
          id: 'qta4',
          question: 'On a daily candlestick chart, what does a long lower wick (shadow) with a small upper body signify?',
          options: [
            'Sellers dominated the entire session without any resistance',
            'Intense intraday selling was completely absorbed and rejected by aggressive buyers pushing price back near the open/close',
            'The exchange order book experienced zero liquidity',
            'A negative regulatory news event has finalized'
          ],
          correctIndex: 1,
          explanation: 'A long lower wick (hammer/pinbar) reveals that bears drove prices down during the session, but buyers stepped in forcefully to reject the lower prices.'
        }
      ]
    }
  },
  {
    id: 'algo-trading-bots',
    title: 'Course 3: Quantitative Algorithmic Trading & Automated Bots',
    shortTitle: 'Algorithmic Trading & Bots',
    level: 'Intermediate',
    readTime: '25 min',
    instructor: 'Engr. Zain-ul-Abideen',
    description: 'Explore autonomous bot fleets (RSI, AI Momentum, DCA, Grid), backtesting, slippage, and MetaTrader 5 MQL5 Expert Advisors.',
    lessons: [
      {
        id: 'lesson-bot-1',
        title: 'Autonomous Trading Bot Fleets & Order Mechanics',
        content: `Quantitative trading replaces human emotion, fatigue, and hesitation with algorithmic rule sets executed automatically:

Our 4 Autonomous Paper Trading Bot Strategies:
1. RSI Mean-Reversion Bot: Best for oscillating sideways ranges. Buys when RSI drops below 30 (oversold) and takes profit when RSI reaches 65.
2. AI-LSTM Momentum Breakout Bot: Best for strong trend expansions. Triggers long entries when the PyTorch neural forecast projects a 24h price rise exceeding +2.5% with Bayesian confidence > 85%.
3. Dollar-Cost Averaging (DCA) Accumulator: Best for long-term spot holding. Automatically allocates fixed USDT capital at scheduled intervals regardless of price volatility, mathematically lowering average cost basis.
4. Grid Volatility Trading Bot: Best for high-frequency choppy channels. Places an equidistant ladder of buy limit orders below current price and sell limit orders above it, scalping profits on every wave.`,
        keyTakeaway: 'Trading bots do not eliminate market risk; they systematically enforce disciplined execution rules without psychological bias.'
      },
      {
        id: 'lesson-bot-2',
        title: 'Realistic Backtesting: Slippage, Fees & Max Drawdown',
        content: `A trading strategy that looks profitable on paper will fail in live markets if it ignores microstructural friction:

Crucial Backtesting Variables:
• Exchange Maker/Taker Fees: Spot exchanges charge transaction fees (typically 0.1% per trade). A high-frequency bot generating 20 trades a day can easily surrender 50% of its gross profits in trading fees.
• Slippage & Spread: The difference between the expected execution price and the actual fill price on large market orders due to order book depth.
• Maximum Drawdown (MDD): The largest percentage drop from a portfolio's peak to its subsequent trough before a new peak is reached. A strategy with a 75% win rate but an 80% maximum drawdown risks complete liquidation under leverage.
• Sharpe Ratio: Measures risk-adjusted return: (Portfolio Return - Risk-Free Rate) / Standard Deviation of Return. A Sharpe Ratio > 1.5 indicates robust performance.`,
        keyTakeaway: 'Evaluate algorithmic strategies by their Sharpe Ratio and Maximum Drawdown, never purely by gross win rate.'
      },
      {
        id: 'lesson-bot-3',
        title: 'MetaTrader 5 & MQL5 Expert Advisor Integration',
        content: `For institutional and forex/crypto broker execution, strategies are written in MQL5 (MetaQuotes Language 5), an object-oriented C++ derivative:

Key MQL5 Architectural Components:
• Event Handlers:
  - OnInit(): Initializes indicators, buffers, and grid order parameters upon EA attachment.
  - OnTick(): Triggered in real time on every incoming price tick to evaluate entry/exit logic.
  - OnDeinit(): Cleans up allocated handles, indicators, and open sockets.
• Standard Trade Libraries: Using <Trade\\Trade.mqh> and CTrade classes to manage order placement, trailing stop-losses, and lot size calculations.
• Strategy Tester: MQL5 features a high-speed multi-threaded Strategy Tester supporting historical tick modeling, genetic optimization, and forward walk-forward testing.`,
        keyTakeaway: 'MQL5 Expert Advisors allow seamless deployment of institutional algorithmic logic to standard MetaTrader 5 brokerage terminals.'
      }
    ],
    quiz: {
      id: 'quiz-algo-trading',
      title: 'Algorithmic Trading & Bot Engineering Quiz',
      passingScore: 75,
      questions: [
        {
          id: 'qbot1',
          question: 'In which market condition is a Grid Trading Volatility Bot most profitable?',
          options: [
            'In a parabolic vertical bull run without any pullbacks',
            'In a choppy, sideways oscillating range where price bounces repeatedly between upper and lower grid boundaries',
            'During a catastrophic 90% flash crash straight down',
            'When the exchange order matching engine is offline'
          ],
          correctIndex: 1,
          explanation: 'Grid trading profits from continuous volatility oscillations, repeatedly buying at lower grid rungs and selling at higher rungs within a defined price channel.'
        },
        {
          id: 'qbot2',
          question: 'What is "Slippage" in automated algorithmic execution?',
          options: [
            'A bug causing the bot code to delete itself',
            'The difference between the expected execution price and the actual executed price caused by order book liquidity and market latency',
            'The interest rate charged for holding USDT in a paper wallet',
            'A discount offered by exchanges for high-volume traders'
          ],
          correctIndex: 1,
          explanation: 'Slippage occurs when market orders execute through multiple levels of the order book during high volatility or low liquidity.'
        },
        {
          id: 'qbot3',
          question: 'In MQL5 for MetaTrader 5, which built-in event handler function executes on every incoming real-time price change?',
          options: [
            'OnInit()',
            'OnTick()',
            'OnDeinit()',
            'OnChartEvent()'
          ],
          correctIndex: 1,
          explanation: 'OnTick() is the primary execution loop of an MQL5 Expert Advisor, triggered whenever a new bid/ask price tick arrives from the broker.'
        },
        {
          id: 'qbot4',
          question: 'Why can a strategy with a high 85% win rate still result in net capital loss?',
          options: [
            'If the average loss on the 15% losing trades is massively larger than the small gains on the 85% winning trades (poor Risk-to-Reward ratio)',
            'Because win rates have no mathematical correlation with account balance',
            'Because trading bots only work during standard banking hours',
            'Due to blockchain network gas re-evaluations'
          ],
          correctIndex: 0,
          explanation: 'Win rate without risk-reward context is deceptive: if a bot wins $10 eighty-five times ($850) but loses $600 on fifteen losing trades ($9,000), the net result is devastating loss.'
        }
      ]
    }
  },
  {
    id: 'defi-smart-contracts',
    title: 'Course 4: Decentralized Finance (DeFi) & Smart Contract Mechanics',
    shortTitle: 'DeFi & Smart Contracts',
    level: 'Intermediate',
    readTime: '22 min',
    instructor: 'Engr. Farhan Ijaz',
    description: 'Understand Automated Market Makers (AMM), Constant Product Formulas, Liquidity Pools, Impermanent Loss, and Lending Protocols.',
    lessons: [
      {
        id: 'lesson-defi-1',
        title: 'Automated Market Makers & Constant Product Formula',
        content: `Traditional exchanges rely on Central Limit Order Books (CLOB) where buyers and sellers place limit orders. Decentralized exchanges (DEXs like Uniswap) pioneer Automated Market Makers (AMMs):

The Constant Product Formula:
x * y = k
• x = Reserve balance of Token A in the liquidity pool
• y = Reserve balance of Token B in the liquidity pool
• k = Fixed invariant constant

How Swaps Work:
When a trader buys Token A using Token B, they deposit Token B into the pool and withdraw Token A. To keep k constant, the pool's internal price of Token A rises automatically. This allows 24/7 autonomous liquidity without market-making intermediaries.`,
        keyTakeaway: 'The constant product formula (x * y = k) algorithmically prices digital assets based on relative pool reserve balances.'
      },
      {
        id: 'lesson-defi-2',
        title: 'Liquidity Provision & Impermanent Loss Explained',
        content: `Liquidity providers (LPs) deposit equal dollar values of two tokens (e.g. 50% ETH and 50% USDT) into an AMM pool to earn a portion of every trading fee (typically 0.3%).

Understanding Impermanent Loss:
• Definition: The difference in portfolio value between depositing tokens into an AMM pool versus simply holding ("HODLing") them in a private wallet.
• Why it Occurs: As the price of ETH rises on external markets, arbitrageurs trade with the pool, draining the rising asset (ETH) and depositing the declining asset (USDT) until the pool price matches the global market.
• When is it Permanent?: The loss is only theoretical ("impermanent") while funds remain in the pool; it becomes permanently realized the moment liquidity is withdrawn at divergent price ratios.`,
        keyTakeaway: 'High trading fee yields and staking incentives are necessary to offset potential impermanent loss during volatile market trends.'
      },
      {
        id: 'lesson-defi-3',
        title: 'Decentralized Lending & Over-Collateralization',
        content: `DeFi money markets (like Aave and Compound) permit permissionless lending and borrowing without credit checks or identity verification:

Key Lending Mechanics:
• Over-Collateralization: To borrow $1,000 worth of stablecoins (USDT/USDC), a borrower must deposit more than $1,000 in volatile collateral (e.g. $1,500 of ETH) to absorb market volatility.
• Loan-to-Value (LTV) Ratio: The maximum borrowing capacity relative to deposited collateral (e.g., 75% LTV).
• Liquidation Threshold & Penalty: If the collateral's price drops and the loan reaches the liquidation threshold (e.g. 82%), automated bot liquidators step in, repaying the debt and claiming the collateral at a 5-10% discount.`,
        keyTakeaway: 'Over-collateralization safeguards DeFi lending protocols against borrower defaults without needing centralized legal enforcement.'
      }
    ],
    quiz: {
      id: 'quiz-defi-smart-contracts',
      title: 'Decentralized Finance & Smart Contracts Quiz',
      passingScore: 75,
      questions: [
        {
          id: 'qdefi1',
          question: 'What is the underlying formula governing Uniswap v2 Automated Market Maker liquidity pools?',
          options: [
            'x + y = k',
            'x * y = k',
            'x / y = k',
            'x^2 + y^2 = k'
          ],
          correctIndex: 1,
          explanation: 'The Constant Product Market Maker formula is x * y = k, where the product of the two token reserves must remain constant after every trade.'
        },
        {
          id: 'qdefi2',
          question: 'What does "Impermanent Loss" measure for a DeFi liquidity provider?',
          options: [
            'The transaction fee paid to Ethereum validators',
            'The difference in dollar value between providing liquidity in an AMM pool versus simply holding the tokens in a cold wallet',
            'The total loss when a hardware wallet battery expires',
            'The reduction in staking rewards caused by validator slashing'
          ],
          correctIndex: 1,
          explanation: 'Impermanent loss occurs when the price ratio of pooled tokens diverges from when they were deposited, resulting in lower total value than holding outside the pool.'
        },
        {
          id: 'qdefi3',
          question: 'Why do decentralized lending protocols require borrowers to over-collateralize their loans?',
          options: [
            'Because smart contracts cannot perform traditional credit background checks or seize real-world physical assets upon default',
            'To pay for government banking insurance taxes',
            'Because blockchain technology cannot store numbers less than 100',
            'To prevent users from opening more than one wallet address'
          ],
          correctIndex: 0,
          explanation: 'Because DeFi is pseudonymous and permissionless, protocols require surplus crypto collateral so loans can be liquidated on-chain if borrower positions deteriorate.'
        },
        {
          id: 'qdefi4',
          question: 'What triggers an automated liquidation event in a decentralized lending protocol?',
          options: [
            'The borrower forgets their wallet password',
            'The value of the borrower\'s collateral declines such that their Loan-to-Value (LTV) ratio breaches the liquidation threshold',
            'The protocol developers manually click a liquidation button',
            'The annual tax season begins'
          ],
          correctIndex: 1,
          explanation: 'When collateral drops in market value and breaches the protocol\'s safety buffer, automated liquidator bots immediately repay the debt to protect pool solvency.'
        }
      ]
    }
  },
  {
    id: 'ai-trading-models',
    title: 'Course 5: Machine Learning & AI Time-Series Modeling',
    shortTitle: 'Machine Learning & AI Modeling',
    level: 'Advanced',
    readTime: '25 min',
    instructor: 'Engr. Farhan Ijaz',
    description: 'Explore sequential deep learning, PyTorch LSTM networks, 95% Bayesian confidence bands, and multi-modal NLP sentiment analysis.',
    lessons: [
      {
        id: 'lesson-ai-1',
        title: 'Sequential Deep Learning & PyTorch LSTMs',
        content: `Financial asset time-series data presents non-linear temporal dependencies, non-stationarity, and regime changes that traditional statistical linear regressions fail to model:

Why Long Short-Term Memory (LSTM) Networks?
• Vanishing Gradient Solution: Standard Recurrent Neural Networks (RNNs) suffer from exponential gradient decay over multi-step sequences. LSTMs maintain an explicit cell state regulated by three specialized gates:
  1. Forget Gate: Evaluates prior volatility history and discards obsolete information via a sigmoid function.
  2. Input Gate: Regulates what fraction of new incoming feature tensors (OHLCV, RSI, MACD) to update into cell memory.
  3. Output Gate: Generates the forward predictive price trajectory vector for 24h, 7d, 30d, and 90d horizons.
• PyTorch Microservice Pipeline: Our Python FastAPI AI engine ingests real-time market data, normalizes tensors using rolling MinMax scalers, and outputs inference in sub-50 milliseconds.`,
        keyTakeaway: 'LSTMs model complex sequential dependencies across volatile crypto time-series by maintaining gated temporal memory.'
      },
      {
        id: 'lesson-ai-2',
        title: 'Bayesian Uncertainty & 95% Risk Envelopes',
        content: `Predictive models that produce only single-point price targets (e.g. "BTC will hit $72,500") are dangerously deceptive because financial markets are inherently stochastic and non-deterministic:

The Bayesian Dispersion Approach:
• Epistemic vs Aleatoric Uncertainty: Epistemic uncertainty stems from model parameter variance; aleatoric uncertainty captures inherent market randomness.
• Monte Carlo Dropout & Bayesian Envelopes: During inference, dropout layers are kept active across multiple forward passes to construct a statistical probability density function.
• 95% Confidence Envelopes: Our engine renders upper (bullish boundary) and lower (bearish boundary) bands. If spot price breaches the upper boundary, it flags an extreme momentum breakout; if it breaks below, it triggers stop-loss warnings.`,
        keyTakeaway: 'Always evaluate AI predictions through their statistical confidence intervals rather than relying on deterministic point targets.'
      },
      {
        id: 'lesson-ai-3',
        title: 'Multi-Modal NLP News Sentiment Analysis',
        content: `Cryptocurrency markets are heavily driven by narrative velocity, macroeconomic announcements, and social sentiment:

NLP Sentiment Architecture:
• Tokenization & Transformer Polarity: Ingests real-time crypto headlines and social feeds, passing them through transformer classification models (e.g., FinBERT / RoBERTa) to output polarity scores between -1.0 (Extreme Fear) and +1.0 (Extreme Greed).
• Weighting Macro Signals: Institutional ETF inflows, regulatory legal updates, and federal interest rate decisions are dynamically assigned multi-factor weights in the overall AI sentiment score.`,
        keyTakeaway: 'Combining numerical time-series LSTMs with NLP sentiment polarity yields higher multi-factor forecasting accuracy.'
      }
    ],
    quiz: {
      id: 'quiz-ai-trading',
      title: 'Machine Learning & Predictive Modeling Quiz',
      passingScore: 75,
      questions: [
        {
          id: 'qai1',
          question: 'Why are Long Short-Term Memory (LSTM) networks superior to traditional Recurrent Neural Networks (RNNs) for crypto forecasting?',
          options: [
            'LSTMs eliminate all financial risk and guarantee 100% winning trades',
            'LSTMs utilize gated cell states (forget, input, output gates) that overcome the vanishing gradient problem over long sequences',
            'LSTMs do not require historical training data',
            'LSTMs can only operate inside Bitcoin blockchain blocks'
          ],
          correctIndex: 1,
          explanation: 'By using dedicated forget, input, and output gates, LSTMs preserve critical gradient flow across dozens of time steps without numerical decay.'
        },
        {
          id: 'qai2',
          question: 'Why does our AI prediction system display 95% Bayesian Confidence Interval bands around forecasted prices?',
          options: [
            'To hide prediction errors when the server crashes',
            'To quantify statistical market stochasticity and uncertainty boundaries rather than presenting a misleading single deterministic price',
            'To show the minimum and maximum gas fees on Ethereum',
            'To indicate exchange maintenance reboot windows'
          ],
          correctIndex: 1,
          explanation: 'Financial markets are probabilistic. Displaying upper and lower Bayesian boundaries illustrates the dispersion of potential outcomes under stochastic volatility.'
        },
        {
          id: 'qai3',
          question: 'What is the role of NLP (Natural Language Processing) models in modern multi-modal crypto prediction engines?',
          options: [
            'To automatically write code for new blockchain nodes',
            'To analyze news headlines, institutional ETF reports, and social feeds to quantify market sentiment polarity',
            'To translate user passwords into foreign languages',
            'To verify miner physical hardware serial numbers'
          ],
          correctIndex: 1,
          explanation: 'NLP transformer models convert unstructured textual data (news, SEC filings, macro reports) into structured sentiment polarity scores that feed into predictive models.'
        },
        {
          id: 'qai4',
          question: 'What is "Data Normalization" (e.g. Min-Max Scaling) in machine learning training pipelines?',
          options: [
            'Deleting 90% of the training dataset at random',
            'Scaling diverse numerical features (price, volume, RSI) to a uniform range (such as [0, 1]) to prevent large numbers from dominating gradient descent',
            'Rounding all cryptocurrency prices to the nearest thousand dollars',
            'Translating Python code into C++'
          ],
          correctIndex: 1,
          explanation: 'Normalization prevents features with large absolute magnitudes (like Bitcoin\'s $68,000 price) from overwhelming features with small ranges (like RSI 0-100 or Volume).'
        }
      ]
    }
  },
  {
    id: 'risk-management',
    title: 'Course 6: Institutional Risk Management, Psychology & Drawdown Control',
    shortTitle: 'Risk Management & Psychology',
    level: 'Advanced',
    readTime: '18 min',
    instructor: 'Dr. Sarah Jenkins, CFA',
    description: 'Master mathematical position sizing, the 1-2% risk rule, Risk-to-Reward (R:R) ratios, stop-loss discipline, and psychological bias control.',
    lessons: [
      {
        id: 'lesson-risk-1',
        title: 'The Mathematics of Position Sizing & The 1% Rule',
        content: `Amateur traders focus entirely on "how much money can I make?" Institutional quantitative traders focus exclusively on "how much capital could I lose if I am wrong?"

The Golden 1-2% Risk Rule:
Never risk more than 1% to 2% of total portfolio equity on any single trade setup. Note that risking 1% does NOT mean your position size is 1% of your account—it means your maximum loss if your stop-loss is hit equals 1% of your total account.

Position Sizing Formula:
Position Size = (Account Equity * Risk Percentage) / (Entry Price - Stop Loss Price)

Example:
• Account Equity = $10,000
• Risk Tolerance = 1% ($100 maximum risk)
• Entry Price for BTC = $68,000
• Technical Stop-Loss = $66,000 (Distance = $2,000, or 2.94%)
• Position Size = $100 / $2,000 = 0.05 BTC ($3,400 allocated)
If BTC drops to $66,000, you exit cleanly with an exact $100 loss (1% of account).`,
        keyTakeaway: 'Determine your technical stop-loss first, then calculate position size backwards from your dollar risk.'
      },
      {
        id: 'lesson-risk-2',
        title: 'Risk-to-Reward Ratios (R:R) & Expectancy Mathematics',
        content: `A trader with a 40% win rate can be significantly more profitable than a trader with a 70% win rate if their Risk-to-Reward ratio is properly structured:

Mathematical Expectancy Formula:
Expectancy = (Win Rate * Average Win) - (Loss Rate * Average Loss)

Asymmetric R:R Setups (Minimum 1:2 or 1:3):
• If you risk $100 to make $300 (1:3 R:R):
  - In 10 trades with only 4 wins (40% win rate):
  - 4 wins * $300 = +$1,200
  - 6 losses * $100 = -$600
  - Net Profit = +$600 (Profitable despite losing 60% of trades!)`,
        keyTakeaway: 'Asymmetric risk-to-reward ratios ensure that a few winning trades mathematically outpace multiple small losses.'
      },
      {
        id: 'lesson-risk-3',
        title: 'Behavioral Finance, FOMO & Emotional Discipline',
        content: `Trading psychology is the ultimate hurdle for retail market participants:

Major Cognitive Traps in Crypto Trading:
• FOMO (Fear Of Missing Out): Buying into parabolic vertical green candles near market tops due to social euphoria.
• Revenge Trading: Doubling down on position size immediately after a loss to "win back" capital, invariably leading to catastrophic account liquidation.
• Disposition Effect: Cutting winning trades prematurely while holding onto losing trades hoping they "come back to break even".
• Paper Trading Validation: By mastering execution in a zero-risk simulated sandbox with $10,000 virtual capital, traders develop psychological resilience before risking real money.`,
        keyTakeaway: 'The goal of trading is not to be right on every trade, but to execute a positive-expectancy system with ironclad emotional discipline.'
      }
    ],
    quiz: {
      id: 'quiz-risk-management',
      title: 'Institutional Risk Management & Capital Preservation Quiz',
      passingScore: 75,
      questions: [
        {
          id: 'qrm1',
          question: 'If you have a $10,000 account and adhere to the 1% risk rule, what is the maximum dollar amount you should lose if your stop-loss is triggered?',
          options: [
            '$1,000',
            '$100',
            '$10',
            '$500'
          ],
          correctIndex: 1,
          explanation: 'The 1% risk rule dictates that if your technical stop-loss is triggered, your total realized loss equals exactly 1% of total portfolio equity ($100 on a $10,000 account).'
        },
        {
          id: 'qrm2',
          question: 'With a 1:3 Risk-to-Reward (R:R) ratio on every trade, what is the minimum win rate required to break even?',
          options: [
            '50%',
            '25%',
            '75%',
            '90%'
          ],
          correctIndex: 1,
          explanation: 'At 1:3 R:R, 1 win (+3 units) cancels out 3 losses (-3 units). Therefore, a 25% win rate is the exact mathematical breakeven threshold.'
        },
        {
          id: 'qrm3',
          question: 'What is "Revenge Trading"?',
          options: [
            'Shorting a cryptocurrency after reading a negative audit report',
            'Emotionally opening aggressive, oversized trades immediately after a loss in an impulsive attempt to recover lost capital',
            'Writing smart contracts that penalize other traders',
            'Reporting an exchange to financial authorities'
          ],
          correctIndex: 1,
          explanation: 'Revenge trading is a destructive psychological reaction where frustration overrides risk rules, often precipitating catastrophic account drawdowns.'
        },
        {
          id: 'qrm4',
          question: 'How should an institutional trader calculate position size on a spot cryptocurrency entry?',
          options: [
            'Invest 100% of available account balance on every signal',
            'Identify the logical technical stop-loss price first, then calculate position size using: (Account * Risk %) / (Entry - Stop Loss)',
            'Always buy exactly 1.0 Bitcoin regardless of account size',
            'Rely on social media sentiment popularity polls'
          ],
          correctIndex: 1,
          explanation: 'Professional risk management works backwards: determine the price where your trade idea is invalidated (stop-loss), then size the position so hitting that stop equals your allowed dollar risk.'
        }
      ]
    }
  }
];
