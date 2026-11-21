import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPercent } from '../utils/formatters';
import {
  TrendingUp,
  BrainCircuit,
  Bot,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Sparkles,
  BookOpen,
  PieChart,
  Lock,
  Globe2,
  ChevronRight,
  Activity,
  Cpu,
  Coins
} from 'lucide-react';

export const HomePage = ({ onNavigate }) => {
  const { cryptos, globalMetrics, wallet } = useCrypto();

  const topCoins = cryptos.slice(0, 4);

  const cryptoKnowledgePillars = [
    {
      icon: Layers,
      color: '#06b6d4',
      title: 'Decentralized Ledgers (Blockchain)',
      description:
        'Cryptocurrencies operate on transparent, distributed peer-to-peer ledgers. Transactions are cryptographically verified by network consensus without reliance on traditional banks or centralized intermediaries.'
    },
    {
      icon: Activity,
      color: '#3b82f6',
      title: '24/7 Continuous Market Volatility',
      description:
        'Unlike conventional equity stock exchanges with fixed trading hours, digital asset markets operate globally 24 hours a day, 365 days a year, driven by order-book liquidity, macroeconomic liquidity, and market sentiment.'
    },
    {
      icon: Cpu,
      color: '#a855f7',
      title: 'AI & Neural Time-Series Models',
      description:
        'Long Short-Term Memory (LSTM) neural networks process multi-timeframe price series, historical volatility, and on-chain metrics to discover recurring non-linear momentum patterns with quantified Bayesian confidence intervals.'
    },
    {
      icon: ShieldCheck,
      color: '#10b981',
      title: 'Zero-Risk Paper Trading Sandbox',
      description:
        'Master technical indicators, candlestick pattern analysis, and automated algorithmic trading bots with $10,000 USDT of virtual capital in a safe simulation before risking real money.'
    }
  ];

  const platformFeatures = [
    {
      id: 'dashboard',
      icon: TrendingUp,
      title: 'Live Crypto Radar',
      badge: 'Real-Time',
      description: 'Stream live spot prices, market capitalization rankings, 24h trading volume, and persistent personalized watchlists.',
      action: 'Explore Markets'
    },
    {
      id: 'prediction',
      icon: BrainCircuit,
      title: 'LSTM AI Forecasting Engine',
      badge: 'FastAPI + PyTorch',
      description: '24h, 7d, 30d, and 90d price forecasts with 95% Bayesian uncertainty envelopes, RSI/MACD overlays, and ETF inflow weights.',
      action: 'View Predictions'
    },
    {
      id: 'trading',
      icon: Bot,
      title: 'Algorithmic Bot Terminal',
      badge: '4 Active Bots',
      description: 'Deploy RSI Mean-Reversion, AI Momentum, DCA Accumulation, and Grid Trading bots with realistic 0.1% fees and slippage.',
      action: 'Launch Trading Bots'
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Crypto Academy & Quizzes',
      badge: 'Interactive',
      description: 'Curated curriculum covering blockchain foundations, DeFi, and risk management with immediate scoring and rewards.',
      action: 'Start Learning'
    }
  ];

  return (
    <div className="home-page-container">
      {/* 1. Hero Banner */}
      <section className="home-hero-section">
        <div className="home-hero-badge">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Next-Generation AI Crypto Intelligence & Educational Ecosystem</span>
        </div>

        <h1 className="home-hero-title">
          Master Crypto Markets with <br />
          <span className="hero-gradient-text">Neural Forecasting</span> &{' '}
          <span className="hero-gradient-text-alt">Autonomous Bots</span>
        </h1>

        <p className="home-hero-subtitle">
          An institutional-grade educational platform blending real-time market data, PyTorch LSTM deep-learning price predictions, interactive paper trading with 4 algorithmic bots, and gamified crypto academy lessons.
        </p>

        <div className="home-hero-actions">
          <button
            className="btn-hero-primary"
            onClick={() => onNavigate('dashboard')}
          >
            <TrendingUp size={18} />
            <span>Explore Live Markets</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="btn-hero-secondary"
            onClick={() => onNavigate('prediction')}
          >
            <BrainCircuit size={18} className="text-cyan-400" />
            <span>Launch AI Predictions</span>
          </button>

          <button
            className="btn-hero-tertiary"
            onClick={() => onNavigate('education')}
          >
            <BookOpen size={18} className="text-purple-400" />
            <span>Academy & Quizzes</span>
          </button>
        </div>

        {/* Global Market Metrics Ribbon */}
        <div className="hero-stats-ribbon">
          <div className="hero-stat-item">
            <span className="hero-stat-label">Total Market Cap</span>
            <span className="hero-stat-value">
              {formatUSD(globalMetrics?.totalMarketCap || 2450000000000)}
            </span>
            <span className="hero-stat-sub positive">+2.84% 24h</span>
          </div>

          <div className="hero-stat-item">
            <span className="hero-stat-label">24h Trading Volume</span>
            <span className="hero-stat-value">
              {formatUSD(globalMetrics?.volume24h || 88400000000)}
            </span>
            <span className="hero-stat-sub text-cyan-400">High Liquidity</span>
          </div>

          <div className="hero-stat-item">
            <span className="hero-stat-label">BTC Dominance</span>
            <span className="hero-stat-value">54.8%</span>
            <span className="hero-stat-sub text-amber-400">Layer-1 Benchmark</span>
          </div>

          <div className="hero-stat-item">
            <span className="hero-stat-label">Virtual Paper Capital</span>
            <span className="hero-stat-value text-emerald-400">
              {formatUSD(wallet?.usdtBalance ?? 10000)}
            </span>
            <span className="hero-stat-sub text-emerald-400">Zero Financial Risk</span>
          </div>
        </div>
      </section>

      {/* 2. Top Coins Live Preview */}
      <section className="home-coins-preview-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Featured Market Leaders</h2>
            <p className="section-subheading">
              Live spot valuations synced with high-throughput market feeds.
            </p>
          </div>
          <button
            className="btn-section-link"
            onClick={() => onNavigate('dashboard')}
          >
            <span>View All Assets ({cryptos.length})</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="home-coins-grid">
          {topCoins.map((coin) => {
            const isPositive = (coin.change24h || 0) >= 0;
            return (
              <div
                key={coin.id || coin.symbol}
                className="home-coin-card"
                onClick={() => onNavigate('dashboard')}
                title={`Click to view ${coin.name} analytics`}
              >
                <div className="coin-card-header">
                  <div className="coin-card-identity">
                    <span className="coin-symbol-badge">{coin.symbol}</span>
                    <span className="coin-name-label">{coin.name}</span>
                  </div>
                  <span className={`coin-change-pill ${isPositive ? 'positive' : 'negative'}`}>
                    {formatPercent(coin.change24h || 0)}
                  </span>
                </div>

                <div className="coin-card-price">
                  {formatUSD(coin.price || 0)}
                </div>

                <div className="coin-card-footer">
                  <span className="text-muted">Cap: {formatUSD(coin.marketCap || 0)}</span>
                  <span className="coin-category-pill">{coin.category || 'Layer 1'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. What is Cryptocurrency? Educational Foundations */}
      <section className="home-crypto-overview-section">
        <div className="section-badge-center">
          <Globe2 size={15} className="text-cyan-400" />
          <span>Understanding Digital Assets</span>
        </div>
        <h2 className="section-heading text-center">
          What is Cryptocurrency and How Does It Work?
        </h2>
        <p className="section-subheading text-center max-w-2xl">
          A modern primer on decentralized protocols, market dynamics, and why quantitative AI modeling has revolutionized crypto asset analysis.
        </p>

        <div className="pillars-grid">
          {cryptoKnowledgePillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="pillar-card">
                <div
                  className="pillar-icon-wrapper"
                  style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}
                >
                  <Icon size={26} />
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section className="home-features-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Integrated Platform Modules</h2>
            <p className="section-subheading">
              Everything you need to learn, analyze, and simulate trading in one unified environment.
            </p>
          </div>
        </div>

        <div className="platform-features-grid">
          {platformFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.id} className="platform-feature-card">
                <div className="feature-card-top">
                  <div className="feature-icon-box">
                    <Icon size={24} className="text-cyan-400" />
                  </div>
                  <span className="feature-badge">{feat.badge}</span>
                </div>

                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-description">{feat.description}</p>

                <button
                  className="btn-feature-action"
                  onClick={() => onNavigate(feat.id)}
                >
                  <span>{feat.action}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Quick Workflow / How-To Steps */}
      <section className="home-workflow-section">
        <h2 className="section-heading text-center">Three Steps to Master Crypto</h2>
        <p className="section-subheading text-center max-w-xl">
          Follow our recommended educational pathway to build confidence and analytical expertise.
        </p>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-number">01</div>
            <h4>Explore & Learn</h4>
            <p>
              Browse live price tickers, study technical indicators like RSI and MACD, and read beginner to advanced modules in the Academy.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">02</div>
            <h4>Analyze AI Forecasts</h4>
            <p>
              Inspect PyTorch LSTM multi-day price targets, Bayesian uncertainty envelopes, and on-chain ETF inflow impact weights.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">03</div>
            <h4>Simulate & Automate</h4>
            <p>
              Practice simulated spot orders or activate autonomous bots (RSI, AI Momentum, DCA, Grid) with $10,000 risk-free capital.
            </p>
          </div>
        </div>

        <div className="workflow-cta-banner">
          <div>
            <h3>Ready to dive into the ecosystem?</h3>
            <p>Start with the Crypto Education Academy or jump straight into Live Market analytics.</p>
          </div>
          <div className="cta-banner-buttons">
            <button className="btn-hero-primary" onClick={() => onNavigate('education')}>
              <GraduationCap size={18} />
              <span>Enter Academy</span>
            </button>
            <button className="btn-hero-secondary" onClick={() => onNavigate('about')}>
              <span>About the Project</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
