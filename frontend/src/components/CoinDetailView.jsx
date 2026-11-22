import React, { useState, useMemo } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { getCoinInfo } from '../data/coinInfoData';
import { formatUSD, formatCompact, formatPercent, formatPKR } from '../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  BrainCircuit,
  Bot,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  FileText,
  Code2,
  Database,
  Layers,
  Activity,
  Cpu,
  BarChart3,
  CheckCircle2,
  Clock,
  Coins,
  Compass,
  Sparkles
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const CoinDetailView = ({
  coin,
  onBack,
  onNavigateToPrediction,
  onNavigateToTrading
}) => {
  const { watchlist, toggleWatchlist } = useCrypto();
  const [timeframe, setTimeframe] = useState('7D'); // '24H' | '7D' | '1M' | 'ALL'

  if (!coin) return null;

  const isFav = watchlist.includes(coin.id);
  const coinInfo = useMemo(() => getCoinInfo(coin), [coin]);

  // Derived price stats
  const isPositive24h = (coin.change24h || 0) >= 0;
  const isPositive7d = (coin.change7d || 0) >= 0;

  // Approximate 24h Low and High from current price & 24h change
  const low24h = useMemo(() => {
    const delta = Math.abs(coin.change24h || 1) / 100;
    const factor = isPositive24h ? 1 - delta * 0.8 : 1 - delta * 1.2;
    return coin.price * Math.max(factor, 0.75);
  }, [coin.price, coin.change24h, isPositive24h]);

  const high24h = useMemo(() => {
    const delta = Math.abs(coin.change24h || 1) / 100;
    const factor = isPositive24h ? 1 + delta * 1.2 : 1 + delta * 0.8;
    return coin.price * factor;
  }, [coin.price, coin.change24h, isPositive24h]);

  // Progress percentage of current price between 24h low and 24h high
  const priceRangePercent = useMemo(() => {
    if (high24h <= low24h) return 50;
    const pct = ((coin.price - low24h) / (high24h - low24h)) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }, [coin.price, low24h, high24h]);

  // Difference in USD over 24 hours
  const deltaUSD = useMemo(() => {
    const originalPrice = coin.price / (1 + (coin.change24h || 0) / 100);
    return coin.price - originalPrice;
  }, [coin.price, coin.change24h]);

  // All-time high difference percentage
  const athDifference = useMemo(() => {
    if (!coin.allTimeHigh || coin.allTimeHigh <= 0) return null;
    return (((coin.price - coin.allTimeHigh) / coin.allTimeHigh) * 100).toFixed(2);
  }, [coin.price, coin.allTimeHigh]);

  // Volume to market cap ratio
  const volToMcapRatio = useMemo(() => {
    if (!coin.marketCap || coin.marketCap <= 0) return '0.00';
    return (coin.volume24h / coin.marketCap).toFixed(4);
  }, [coin.volume24h, coin.marketCap]);

  // Chart datasets based on selected timeframe
  const chartData = useMemo(() => {
    let labels = [];
    let dataPoints = [];

    if (timeframe === '24H') {
      labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];
      const base = coin.price - deltaUSD;
      const step = deltaUSD / 6;
      dataPoints = [
        base,
        base + step * 0.8 + (Math.random() * 0.005 - 0.0025) * base,
        base + step * 2.1 + (Math.random() * 0.005 - 0.0025) * base,
        base + step * 3.4 - (Math.random() * 0.005 - 0.0025) * base,
        base + step * 4.2 + (Math.random() * 0.005 - 0.0025) * base,
        base + step * 5.3 + (Math.random() * 0.005 - 0.0025) * base,
        coin.price
      ];
    } else if (timeframe === '7D') {
      labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
      dataPoints = (coin.history7d && coin.history7d.length >= 7)
        ? [...coin.history7d.slice(0, 6), coin.price]
        : [coin.price * 0.94, coin.price * 0.96, coin.price * 0.95, coin.price * 0.98, coin.price * 0.99, coin.price * 0.995, coin.price];
    } else if (timeframe === '1M') {
      labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'Now'];
      dataPoints = (coin.history30d && coin.history30d.length >= 10)
        ? [...coin.history30d.slice(0, 9), coin.price]
        : [coin.price * 0.88, coin.price * 0.90, coin.price * 0.92, coin.price * 0.91, coin.price * 0.94, coin.price * 0.96, coin.price * 0.97, coin.price * 0.98, coin.price * 0.99, coin.price];
    } else {
      // ALL
      labels = ['1Y Ago', '9M Ago', '6M Ago', '3M Ago', '1M Ago', 'Today'];
      dataPoints = [
        coin.price * 0.65,
        coin.price * 0.72,
        coin.price * 0.85,
        coin.price * 0.79,
        coin.price * 0.93,
        coin.price
      ];
    }

    const primaryColor = coin.color || '#06b6d4';

    return {
      labels,
      datasets: [
        {
          label: `${coin.name} (${coin.symbol}) Price USD`,
          data: dataPoints,
          borderColor: primaryColor,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 320);
            gradient.addColorStop(0, `${primaryColor}44`);
            gradient.addColorStop(1, `${primaryColor}00`);
            return gradient;
          },
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: primaryColor,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: primaryColor,
          pointHoverBorderWidth: 2,
          fill: true,
          tension: 0.35
        }
      ]
    };
  }, [timeframe, coin, deltaUSD]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#ffffff',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 14, weight: 'bold' },
        padding: 12,
        callbacks: {
          label: (context) => ` Price: ${formatUSD(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (value) => formatUSD(value)
        }
      }
    }
  };

  // Technical Indicator evaluations
  const rsiValue = coin.rsi || 50;
  let rsiStatus = 'Neutral';
  let rsiColor = 'text-cyan-400';
  if (rsiValue >= 70) {
    rsiStatus = 'Overbought';
    rsiColor = 'text-rose-400';
  } else if (rsiValue <= 30) {
    rsiStatus = 'Oversold';
    rsiColor = 'text-emerald-400';
  } else if (rsiValue > 55) {
    rsiStatus = 'Bullish Momentum';
    rsiColor = 'text-emerald-400';
  }

  return (
    <div className="coin-detail-view-container">
      {/* 1. Navigation Breadcrumb & Back Bar */}
      <div className="detail-top-nav">
        <button className="btn-back-markets" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to All Cryptocurrencies</span>
        </button>

        <div className="detail-breadcrumbs">
          <span className="crumb-dim">Markets</span>
          <span className="crumb-separator">/</span>
          <span className="crumb-active">{coin.name} ({coin.symbol})</span>
        </div>
      </div>

      {/* 2. Main Live Header Card */}
      <div className="coin-detail-header-card">
        <div className="header-identity-col">
          <div className="coin-brand-row">
            <div
              className="coin-detail-icon-circle"
              style={{ backgroundColor: `${coin.color}22`, borderColor: coin.color }}
            >
              <span style={{ color: coin.color, fontWeight: '800', fontSize: '20px' }}>
                {coin.symbol.charAt(0)}
              </span>
            </div>

            <div className="coin-brand-names">
              <div className="coin-title-row">
                <h1 className="coin-detail-title">{coin.name}</h1>
                <span className="coin-detail-symbol">{coin.symbol}</span>
                <button
                  className={`btn-star-detail ${isFav ? 'starred' : ''}`}
                  onClick={() => toggleWatchlist(coin.id)}
                  title={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Star size={18} fill={isFav ? '#fbbf24' : 'none'} color={isFav ? '#fbbf24' : '#64748b'} />
                </button>
              </div>

              <div className="coin-meta-badges">
                <span className="badge-rank">Rank #1 Benchmark</span>
                <span className="badge-category">{coin.category || 'Layer 1'}</span>
                <span className="badge-consensus">{coinInfo.consensus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Hub */}
        <div className="header-actions-col">
          <button
            className="btn-detail-action trade-btn"
            onClick={() => onNavigateToTrading(coin.id)}
            title="Open paper trading terminal for this asset"
          >
            <Bot size={16} />
            <span>Paper Trade {coin.symbol}</span>
          </button>

          <button
            className="btn-detail-action ai-btn"
            onClick={() => onNavigateToPrediction(coin.id)}
            title="Inspect AI LSTM predictions and Bayesian bands"
          >
            <BrainCircuit size={16} className="text-cyan-400" />
            <span>AI Neural Forecast</span>
          </button>
        </div>
      </div>

      {/* 3. Live Price & 24h High/Low Section */}
      <div className="price-overview-grid">
        <div className="live-price-box">
          <div className="live-price-label">
            <span className="live-pulse-dot"></span>
            <span>Live Spot Price (USD / PKR)</span>
          </div>
          <div className="live-price-large">
            {formatUSD(coin.price)}
          </div>
          <div style={{ fontSize: '14px', color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            ~ {formatPKR(coin.price)}
          </div>

          <div className="price-change-row">
            <span className={`detail-change-pill ${isPositive24h ? 'positive' : 'negative'}`}>
              {isPositive24h ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {isPositive24h ? '+' : ''}{formatUSD(deltaUSD)} ({formatPercent(coin.change24h)}) 24h
              </span>
            </span>

            <span className={`detail-change-sub ${isPositive7d ? 'text-emerald-400' : 'text-rose-400'}`}>
              7d: {formatPercent(coin.change7d)}
            </span>
          </div>
        </div>

        {/* 24h High/Low Range Progress Slider */}
        <div className="high-low-range-box">
          <div className="range-box-header">
            <span className="range-label">24h Low / 24h High Range</span>
            <span className="range-ratio-label">Current: {priceRangePercent.toFixed(0)}% of Range</span>
          </div>

          <div className="range-slider-bar">
            <div
              className="range-progress-fill"
              style={{ width: `${priceRangePercent}%` }}
            ></div>
            <div
              className="range-current-pin"
              style={{ left: `${priceRangePercent}%` }}
              title={`Current Price: ${formatUSD(coin.price)}`}
            ></div>
          </div>

          <div className="range-values-row">
            <div className="range-low">
              <span className="range-sub-text">24h Low</span>
              <span className="range-val">{formatUSD(low24h)}</span>
            </div>
            <div className="range-high">
              <span className="range-sub-text">24h High</span>
              <span className="range-val">{formatUSD(high24h)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Interactive Price Chart */}
      <div className="detail-chart-card">
        <div className="chart-card-header">
          <div className="chart-title-area">
            <BarChart3 size={18} className="text-cyan-400" />
            <h3 className="chart-card-title">{coin.name} Price Chart & Historical Trend</h3>
          </div>

          <div className="timeframe-buttons">
            {['24H', '7D', '1M', 'ALL'].map((tf) => (
              <button
                key={tf}
                className={`btn-tf ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 5. Key Statistics & Financial Data Grid */}
      <div className="stats-section-wrapper">
        <h3 className="section-title-sm">Market Valuation & Core Statistics</h3>
        <div className="coin-stats-grid">
          <div className="stat-card">
            <div className="stat-card-label">Market Capitalization</div>
            <div className="stat-card-val">{formatCompact(coin.marketCap)}</div>
            <div className="stat-card-sub text-muted">Rank #1 in Digital Assets</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">24h Trading Volume</div>
            <div className="stat-card-val">{formatCompact(coin.volume24h)}</div>
            <div className="stat-card-sub text-cyan-400">Vol / Market Cap: {volToMcapRatio}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">Circulating Supply</div>
            <div className="stat-card-val">{coin.circulatingSupply || '19,770,000'}</div>
            <div className="stat-card-sub text-muted">Max: {coinInfo.maxSupply}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">All-Time High (ATH)</div>
            <div className="stat-card-val">{formatUSD(coin.allTimeHigh || 0)}</div>
            <div className={`stat-card-sub ${Number(athDifference) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {athDifference ? `${athDifference}% from ATH` : 'Peak Benchmark'}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">RSI (14) Indicator</div>
            <div className="stat-card-val font-mono">{rsiValue.toFixed(1)}</div>
            <div className={`stat-card-sub ${rsiColor}`}>{rsiStatus}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">Network Consensus</div>
            <div className="stat-card-val text-sm font-semibold">{coinInfo.consensus.split(' ')[0]}</div>
            <div className="stat-card-sub text-muted">Algo: {coinInfo.algorithm}</div>
          </div>
        </div>
      </div>

      {/* 6. Live Technical Analysis Indicators */}
      <div className="technical-indicators-card">
        <div className="tech-header">
          <Activity size={18} className="text-cyan-400" />
          <h3 className="tech-title">Live Technical Indicators & Moving Averages</h3>
        </div>

        <div className="indicators-row-grid">
          <div className="indicator-col">
            <span className="ind-name">Simple Moving Average (SMA 20)</span>
            <span className="ind-val">{formatUSD(coin.sma20 || coin.price * 0.98)}</span>
            <span className="ind-sub positive">
              {coin.price >= (coin.sma20 || coin.price * 0.98) ? 'Above 20-Day SMA' : 'Below 20-Day SMA'}
            </span>
          </div>

          <div className="indicator-col">
            <span className="ind-name">Simple Moving Average (SMA 50)</span>
            <span className="ind-val">{formatUSD(coin.sma50 || coin.price * 0.95)}</span>
            <span className="ind-sub positive">
              {coin.price >= (coin.sma50 || coin.price * 0.95) ? 'Above 50-Day SMA' : 'Below 50-Day SMA'}
            </span>
          </div>

          <div className="indicator-col">
            <span className="ind-name">Bollinger Upper Band</span>
            <span className="ind-val">{formatUSD(coin.bollingerUpper || coin.price * 1.05)}</span>
            <span className="ind-sub text-muted">Resistance Channel</span>
          </div>

          <div className="indicator-col">
            <span className="ind-name">Bollinger Lower Band</span>
            <span className="ind-val">{formatUSD(coin.bollingerLower || coin.price * 0.92)}</span>
            <span className="ind-sub text-muted">Support Channel</span>
          </div>
        </div>
      </div>

      {/* 7. Comprehensive About & Fundamentals Info Section */}
      <div className="coin-about-section">
        <div className="about-section-header">
          <Globe size={20} className="text-cyan-400" />
          <h2>About {coin.name} ({coin.symbol})</h2>
        </div>
        <p className="coin-tagline">{coinInfo.tagline}</p>

        <div className="coin-description-paragraphs">
          {coinInfo.description.split('\n\n').map((paragraph, index) => (
            <p key={index} className="coin-desc-para">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Features List */}
        <div className="about-features-block">
          <h4 className="features-block-title">Key Architectural Highlights</h4>
          <div className="features-checklist">
            {coinInfo.keyFeatures.map((feat, idx) => (
              <div key={idx} className="feature-check-item">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Use Cases */}
        <div className="about-usecases-block">
          <h4 className="features-block-title">Primary Use Cases & Utility</h4>
          <div className="usecases-grid">
            {coinInfo.useCases.map((useCase, idx) => (
              <div key={idx} className="usecase-badge">
                <Zap size={14} className="text-amber-400 shrink-0" />
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts / Fundamentals Table */}
        <div className="fundamentals-table-block">
          <h4 className="features-block-title">Protocol Fundamentals & Specifications</h4>
          <div className="facts-grid">
            <div className="fact-item">
              <span className="fact-label">Founder / Creator</span>
              <span className="fact-value">{coinInfo.founder}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Genesis Launch Date</span>
              <span className="fact-value">{coinInfo.genesisDate}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Consensus Mechanism</span>
              <span className="fact-value">{coinInfo.consensus}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Hashing Algorithm</span>
              <span className="fact-value">{coinInfo.algorithm}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Average Block Time</span>
              <span className="fact-value">{coinInfo.blockTime}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Halving / Issuance Schedule</span>
              <span className="fact-value">{coinInfo.halvingCycle}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Maximum Hard Supply</span>
              <span className="fact-value font-mono">{coinInfo.maxSupply}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Whitepaper</span>
              <span className="fact-value truncate">{coinInfo.whitepaperTitle}</span>
            </div>
          </div>
        </div>

        {/* Official Links & Explorers */}
        <div className="official-links-row">
          <a
            href={coinInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className="link-pill"
          >
            <Globe size={14} />
            <span>Official Website</span>
            <ExternalLink size={12} />
          </a>

          <a
            href={coinInfo.explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="link-pill"
          >
            <Compass size={14} />
            <span>Blockchain Explorer</span>
            <ExternalLink size={12} />
          </a>

          <a
            href={coinInfo.whitepaperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-pill"
          >
            <FileText size={14} />
            <span>Protocol Whitepaper</span>
            <ExternalLink size={12} />
          </a>

          <a
            href={coinInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-pill"
          >
            <Code2 size={14} />
            <span>GitHub Repository</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
