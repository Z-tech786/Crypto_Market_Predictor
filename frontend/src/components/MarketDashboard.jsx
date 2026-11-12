import React, { useState, useMemo } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatCompact, formatPercent } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Search,
  Sparkles,
  BrainCircuit,
  ArrowUpRight,
  Flame,
  Activity,
  Layers,
  BarChart3
} from 'lucide-react';

export const MarketDashboard = ({ onNavigateToPrediction, onNavigateToTrading }) => {
  const { cryptos, globalMetrics, watchlist, toggleWatchlist, setActiveCoinId } = useCrypto();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories
  const categories = ['All', 'Watchlist', 'Layer 1', 'Smart Contracts', 'DeFi', 'Oracle / AI'];

  // Filtered Coins
  const filteredCoins = useMemo(() => {
    return cryptos.filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Watchlist') return watchlist.includes(coin.id);
      return coin.category.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [cryptos, searchQuery, selectedCategory, watchlist]);

  // Top gainers & losers
  const topGainers = useMemo(() => {
    return [...cryptos].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
  }, [cryptos]);

  const topLosers = useMemo(() => {
    return [...cryptos].sort((a, b) => a.change24h - b.change24h).slice(0, 3);
  }, [cryptos]);

  // Mini sparkline SVG generator
  const renderSparkline = (data, isPositive, color) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 110;
    const height = 36;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#10b981' : '#f43f5e';

    return (
      <svg width={width} height={height} className="sparkline-svg">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="dashboard-page">
      {/* 1. Global Metrics Banner */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Tracked Asset Market Cap (est.)</span>
            <Activity size={18} className="text-cyan-400" />
          </div>
          <div className="metric-val">{formatCompact(globalMetrics.totalMarketCap)}</div>
          <div className={`metric-sub ${globalMetrics.marketCapChange24h >= 0 ? 'positive' : 'negative'}`}>
            {globalMetrics.marketCapChange24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {formatPercent(globalMetrics.marketCapChange24h)} (24h)
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Tracked 24h Volume</span>
            <BarChart3 size={18} className="text-blue-400" />
          </div>
          <div className="metric-val">{formatCompact(globalMetrics.volume24h)}</div>
          <div className="metric-sub text-muted">Across {globalMetrics.trackedAssets} tracked spot pairs</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Reference BTC Dominance</span>
            <Layers size={18} className="text-amber-400" />
          </div>
          <div className="metric-val">{globalMetrics.btcDominance}%</div>
          <div className="metric-sub text-muted">ETH Dominance: {globalMetrics.ethDominance}%</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Sample Market Sentiment</span>
            <Flame size={18} className="text-rose-400" />
          </div>
          <div className="metric-val">{globalMetrics.fearGreedIndex} / 100</div>
          <div className="metric-sub sentiment-greed">
            <span className="status-dot"></span> {globalMetrics.fearGreedSentiment} · demo
          </div>
        </div>
      </div>

      {/* 2. Highlights Row: Top Gainers & Trending Losers */}
      <div className="highlights-row">
        <div className="highlight-panel">
          <div className="highlight-header">
            <TrendingUp size={16} className="text-emerald-400" />
            <span>Top 24h Gainers</span>
          </div>
          <div className="highlight-items">
            {topGainers.map((coin) => (
              <div
                key={coin.id}
                className="highlight-item"
                onClick={() => {
                  setActiveCoinId(coin.id);
                  onNavigateToPrediction(coin.id);
                }}
              >
                <div className="highlight-left">
                  <span className="highlight-symbol">{coin.symbol}</span>
                  <span className="highlight-name">{coin.name}</span>
                </div>
                <div className="highlight-right">
                  <div className="highlight-price">{formatUSD(coin.price)}</div>
                  <div className="highlight-badge positive">
                    +{coin.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="highlight-panel">
          <div className="highlight-header">
            <TrendingDown size={16} className="text-rose-400" />
            <span>Market Dip Opportunities</span>
          </div>
          <div className="highlight-items">
            {topLosers.map((coin) => (
              <div
                key={coin.id}
                className="highlight-item"
                onClick={() => {
                  setActiveCoinId(coin.id);
                  onNavigateToPrediction(coin.id);
                }}
              >
                <div className="highlight-left">
                  <span className="highlight-symbol">{coin.symbol}</span>
                  <span className="highlight-name">{coin.name}</span>
                </div>
                <div className="highlight-right">
                  <div className="highlight-price">{formatUSD(coin.price)}</div>
                  <div className="highlight-badge negative">
                    {coin.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="table-controls-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search coin name or symbol (e.g. BTC, Solana)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'Watchlist' && <Star size={13} className="mr-1 inline" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Cryptocurrency Table */}
      <div className="crypto-table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Fav</th>
              <th style={{ width: '50px' }}>#</th>
              <th>Asset</th>
              <th className="text-right">Price</th>
              <th className="text-right">24h Change</th>
              <th className="text-right">7d Trend</th>
              <th className="text-right">24h Volume</th>
              <th className="text-right">Market Cap</th>
              <th className="text-center">7-Day Chart</th>
              <th className="text-center">AI & Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data-cell">
                  No cryptocurrencies match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredCoins.map((coin, index) => {
                const isFav = watchlist.includes(coin.id);
                const is24hUp = coin.change24h >= 0;
                const is7dUp = coin.change7d >= 0;

                return (
                  <tr key={coin.id} className="crypto-row">
                    {/* Watchlist Star */}
                    <td>
                      <button
                        className={`btn-star ${isFav ? 'starred' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(coin.id);
                        }}
                        title={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star size={16} fill={isFav ? '#fbbf24' : 'none'} />
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="rank-cell">{index + 1}</td>

                    {/* Asset Name + Symbol */}
                    <td>
                      <div
                        className="asset-cell"
                        onClick={() => {
                          setActiveCoinId(coin.id);
                          onNavigateToPrediction(coin.id);
                        }}
                      >
                        <div
                          className="coin-icon-circle"
                          style={{ backgroundColor: `${coin.color}22`, borderColor: coin.color }}
                        >
                          <span style={{ color: coin.color, fontWeight: 'bold' }}>
                            {coin.symbol.charAt(0)}
                          </span>
                        </div>
                        <div className="asset-meta">
                          <span className="asset-name">{coin.name}</span>
                          <span className="asset-symbol-cat">
                            <span className="asset-sym">{coin.symbol}</span>
                            <span className="asset-cat-tag">{coin.category}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="text-right font-mono font-semibold">
                      <span className={`price-tick-anim ${coin.lastTickDirection || ''}`}>
                        {formatUSD(coin.price)}
                      </span>
                    </td>

                    {/* 24h Change */}
                    <td className="text-right font-mono">
                      <span className={`change-badge ${is24hUp ? 'positive' : 'negative'}`}>
                        {is24hUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {formatPercent(coin.change24h)}
                      </span>
                    </td>

                    {/* 7d Change */}
                    <td className="text-right font-mono">
                      <span className={is7dUp ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatPercent(coin.change7d)}
                      </span>
                    </td>

                    {/* 24h Volume */}
                    <td className="text-right font-mono text-muted">
                      {formatCompact(coin.volume24h)}
                    </td>

                    {/* Market Cap */}
                    <td className="text-right font-mono text-muted">
                      {formatCompact(coin.marketCap)}
                    </td>

                    {/* Sparkline mini chart */}
                    <td className="text-center">
                      {renderSparkline(coin.history7d, is7dUp, coin.color)}
                    </td>

                    {/* Action buttons */}
                    <td className="text-center actions-cell">
                      <button
                        className="btn-action-predict"
                        onClick={() => {
                          setActiveCoinId(coin.id);
                          onNavigateToPrediction(coin.id);
                        }}
                        title="Open AI Prediction Model & Charts"
                      >
                        <BrainCircuit size={14} />
                        <span>AI Forecast</span>
                      </button>

                      <button
                        className="btn-action-trade"
                        onClick={() => {
                          setActiveCoinId(coin.id);
                          onNavigateToTrading(coin.id);
                        }}
                        title="Open Simulated Paper Trading Terminal"
                      >
                        <span>Trade</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
