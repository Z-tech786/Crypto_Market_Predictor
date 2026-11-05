import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPercent } from '../utils/formatters';
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
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Info,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  BarChart2
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

export const AIPredictionView = ({ onNavigateToTrading }) => {
  const { cryptos, activeCoin, setActiveCoinId } = useCrypto();

  const [timeframe, setTimeframe] = useState('7d'); // '24h' | '7d' | '30d' | '90d'
  const [showIndicators, setShowIndicators] = useState({
    rsi: true,
    bollinger: true,
    movingAvg: true
  });

  const prediction = activeCoin.aiPrediction || {
    trend: 'Bullish',
    confidence: 85.0,
    target24h: activeCoin.price * 1.02,
    target7d: activeCoin.price * 1.06,
    target30d: activeCoin.price * 1.12,
    target90d: activeCoin.price * 1.25,
    upperBound7d: activeCoin.price * 1.09,
    lowerBound7d: activeCoin.price * 1.03,
    factors: []
  };

  // Determine target for selected timeframe
  let targetPrice = prediction.target7d;
  if (timeframe === '24h') targetPrice = prediction.target24h;
  if (timeframe === '30d') targetPrice = prediction.target30d;
  if (timeframe === '90d') targetPrice = prediction.target90d;

  const expectedMovePercent = ((targetPrice - activeCoin.price) / activeCoin.price) * 100;
  const isTargetBullish = expectedMovePercent >= 0;

  // Build Chart Data
  // Labels: Day -6 to Day 0 (historical), Day +1 to Day +7 (prediction)
  const historicalDays = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];
  const forecastDays = ['Day +1', 'Day +2', 'Day +3', 'Day +4', 'Day +5', 'Day +6', 'Day +7'];
  const allLabels = [...historicalDays, ...forecastDays];

  // Historical data (padded with nulls for forecast period)
  const histPoints = activeCoin.history7d || [64000, 65000, 66000, 65500, 67000, 67500, activeCoin.price];
  const histPadded = [...histPoints, ...Array(forecastDays.length).fill(null)];

  // Prediction data (starts at today's price and goes forward)
  const predPoints = activeCoin.predictionSeries7d || [activeCoin.price, activeCoin.price * 1.01, activeCoin.price * 1.02, activeCoin.price * 1.03, activeCoin.price * 1.04, activeCoin.price * 1.05, targetPrice];
  const predPadded = [...Array(historicalDays.length - 1).fill(null), histPoints[histPoints.length - 1], ...predPoints.slice(1)];

  // Upper & Lower CI envelopes
  const upperPoints = activeCoin.predictionUpper7d || predPoints.map(p => p * 1.03);
  const lowerPoints = activeCoin.predictionLower7d || predPoints.map(p => p * 0.97);
  const upperPadded = [...Array(historicalDays.length - 1).fill(null), histPoints[histPoints.length - 1], ...upperPoints.slice(1)];
  const lowerPadded = [...Array(historicalDays.length - 1).fill(null), histPoints[histPoints.length - 1], ...lowerPoints.slice(1)];

  // SMA 20 line (indicator overlay)
  const smaPadded = showIndicators.movingAvg
    ? histPoints.map((p) => p * 0.985).concat(predPoints.slice(1).map((p) => p * 0.985))
    : [];

  const chartData = {
    labels: allLabels,
    datasets: [
      {
        label: 'Historical Price',
        data: histPadded,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#38bdf8'
      },
      {
        label: 'AI Forecast (LSTM)',
        data: predPadded,
        borderColor: '#a855f7',
        borderWidth: 2.5,
        borderDash: [5, 4],
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#a855f7'
      },
      {
        label: 'Upper 95% Confidence Band',
        data: upperPadded,
        borderColor: 'rgba(16, 185, 129, 0.4)',
        borderWidth: 1.5,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: '+1', // Fill down to lower band
        backgroundColor: 'rgba(168, 85, 247, 0.08)'
      },
      {
        label: 'Lower 95% Confidence Band',
        data: lowerPadded,
        borderColor: 'rgba(244, 63, 94, 0.4)',
        borderWidth: 1.5,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false
      },
      ...(showIndicators.movingAvg
        ? [
            {
              label: 'SMA (20-Period)',
              data: smaPadded,
              borderColor: '#f59e0b',
              borderWidth: 1.5,
              pointRadius: 0,
              tension: 0.3
            }
          ]
        : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'inherit', size: 12 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            if (context.raw === null) return null;
            return `${context.dataset.label}: $${Number(context.raw).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#64748b',
          callback: (value) => `$${Number(value).toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="prediction-page">
      {/* 1. Header Bar: Coin Selector & Timeframe Switches */}
      <div className="prediction-header-bar">
        <div className="coin-select-wrap">
          <label className="text-muted text-xs font-semibold uppercase tracking-wider block mb-1">
            Predictive Model Asset
          </label>
          <select
            className="coin-dropdown"
            value={activeCoin.id}
            onChange={(e) => setActiveCoinId(e.target.value)}
          >
            {cryptos.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol}) - Current: {formatUSD(coin.price)}
              </option>
            ))}
          </select>
        </div>

        <div className="horizon-tabs">
          <label className="text-muted text-xs font-semibold uppercase tracking-wider block mb-1">
            Forecast Horizon
          </label>
          <div className="horizon-pills">
            <button
              className={`hz-pill ${timeframe === '24h' ? 'active' : ''}`}
              onClick={() => setTimeframe('24h')}
            >
              24 Hours
            </button>
            <button
              className={`hz-pill ${timeframe === '7d' ? 'active' : ''}`}
              onClick={() => setTimeframe('7d')}
            >
              7 Days
            </button>
            <button
              className={`hz-pill ${timeframe === '30d' ? 'active' : ''}`}
              onClick={() => setTimeframe('30d')}
            >
              30 Days
            </button>
            <button
              className={`hz-pill ${timeframe === '90d' ? 'active' : ''}`}
              onClick={() => setTimeframe('90d')}
            >
              90 Days
            </button>
          </div>
        </div>

        <div className="header-trade-action">
          <button
            className="btn-trade-this-coin"
            onClick={() => onNavigateToTrading(activeCoin.id)}
          >
            <Zap size={15} />
            <span>Simulate Trade</span>
          </button>
        </div>
      </div>

      {/* 2. Model Metrics Cards */}
      <div className="prediction-kpi-grid">
        <div className="pred-kpi-card">
          <div className="pred-kpi-header">
            <span className="pred-kpi-title">Forecast Target ({timeframe.toUpperCase()})</span>
            <Target size={18} className="text-purple-400" />
          </div>
          <div className="pred-kpi-value text-purple-400">{formatUSD(targetPrice)}</div>
          <div className={`pred-kpi-sub ${isTargetBullish ? 'positive' : 'negative'}`}>
            {isTargetBullish ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {formatPercent(expectedMovePercent)} expected change
          </div>
        </div>

        <div className="pred-kpi-card">
          <div className="pred-kpi-header">
            <span className="pred-kpi-title">Model Confidence</span>
            <BrainCircuit size={18} className="text-cyan-400" />
          </div>
          <div className="pred-kpi-value text-cyan-400">{prediction.confidence}%</div>
          <div className="pred-kpi-sub text-muted">
            <CheckCircle size={14} className="text-emerald-400" /> High statistical convergence
          </div>
        </div>

        <div className="pred-kpi-card">
          <div className="pred-kpi-header">
            <span className="pred-kpi-title">Trend Classification</span>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div className="pred-kpi-value text-emerald-400">{prediction.trend}</div>
          <div className="pred-kpi-sub text-muted">
            Multi-Head Attention Layer
          </div>
        </div>

        <div className="pred-kpi-card">
          <div className="pred-kpi-header">
            <span className="pred-kpi-title">Uncertainty Envelope</span>
            <Sliders size={18} className="text-amber-400" />
          </div>
          <div className="pred-kpi-value font-mono text-sm">
            {formatUSD(prediction.lowerBound7d)} - {formatUSD(prediction.upperBound7d)}
          </div>
          <div className="pred-kpi-sub text-muted">
            95% Bayesian Confidence Interval
          </div>
        </div>
      </div>

      {/* 3. Main Chart Panel with Indicator Controls */}
      <div className="chart-panel-card">
        <div className="chart-panel-header">
          <div className="chart-title-area">
            <h3 className="chart-heading">
              {activeCoin.name} ({activeCoin.symbol}) AI Projection vs Historical Price
            </h3>
            <p className="chart-sub">
              Historical performance synchronized with recurrent LSTM forecast and uncertainty bounds
            </p>
          </div>

          <div className="indicator-toggles">
            <label className="toggle-chip">
              <input
                type="checkbox"
                checked={showIndicators.movingAvg}
                onChange={(e) =>
                  setShowIndicators((prev) => ({ ...prev, movingAvg: e.target.checked }))
                }
              />
              <span>SMA (20)</span>
            </label>
            <label className="toggle-chip">
              <input
                type="checkbox"
                checked={showIndicators.rsi}
                onChange={(e) =>
                  setShowIndicators((prev) => ({ ...prev, rsi: e.target.checked }))
                }
              />
              <span>RSI Indicator</span>
            </label>
            <label className="toggle-chip">
              <input
                type="checkbox"
                checked={showIndicators.bollinger}
                onChange={(e) =>
                  setShowIndicators((prev) => ({ ...prev, bollinger: e.target.checked }))
                }
              />
              <span>Bollinger Bands</span>
            </label>
          </div>
        </div>

        <div className="chart-canvas-wrapper" style={{ height: '360px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 4. Technical Indicators & AI Feature Importance */}
      <div className="analysis-split-row">
        {/* Technical Indicators Panel */}
        <div className="analysis-card">
          <div className="analysis-card-header">
            <BarChart2 size={18} className="text-cyan-400" />
            <h4>Quantitative Technical Indicators</h4>
          </div>
          <div className="indicator-metrics-list">
            <div className="ind-row">
              <div className="ind-info">
                <span className="ind-name">Relative Strength Index (14 RSI)</span>
                <span className="ind-desc">Oscillator measuring velocity of price changes</span>
              </div>
              <div className="ind-val-box">
                <span className="ind-number">{activeCoin.rsi}</span>
                <span className={`ind-badge ${activeCoin.rsi > 70 ? 'danger' : activeCoin.rsi < 30 ? 'success' : 'neutral'}`}>
                  {activeCoin.rsi > 70 ? 'Overbought' : activeCoin.rsi < 30 ? 'Oversold' : 'Neutral Momentum'}
                </span>
              </div>
            </div>

            <div className="ind-row">
              <div className="ind-info">
                <span className="ind-name">MACD (12, 26, 9)</span>
                <span className="ind-desc">Trend-following momentum relationship</span>
              </div>
              <div className="ind-val-box">
                <span className="ind-number">+{activeCoin.macd}</span>
                <span className="ind-badge success">Bullish Crossover</span>
              </div>
            </div>

            <div className="ind-row">
              <div className="ind-info">
                <span className="ind-name">Bollinger Band Position</span>
                <span className="ind-desc">Upper: {formatUSD(activeCoin.bollingerUpper)} | Lower: {formatUSD(activeCoin.bollingerLower)}</span>
              </div>
              <div className="ind-val-box">
                <span className="ind-badge neutral">Mid-Upper Band Test</span>
              </div>
            </div>

            <div className="ind-row">
              <div className="ind-info">
                <span className="ind-name">Moving Averages (SMA 50 / 200)</span>
                <span className="ind-desc">SMA50: {formatUSD(activeCoin.sma50)} | SMA200: {formatUSD(activeCoin.sma200)}</span>
              </div>
              <div className="ind-val-box">
                <span className="ind-badge success">Golden Cross Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Feature Weights & Drivers */}
        <div className="analysis-card">
          <div className="analysis-card-header">
            <BrainCircuit size={18} className="text-purple-400" />
            <h4>Neural Feature Importance & Drivers</h4>
          </div>
          <div className="feature-factors-list">
            {prediction.factors && prediction.factors.length > 0 ? (
              prediction.factors.map((factor, i) => (
                <div key={i} className="feature-factor-item">
                  <div className="factor-top">
                    <span className="factor-title">{factor.name}</span>
                    <span className={`factor-weight ${factor.impact}`}>
                      {factor.weight}
                    </span>
                  </div>
                  <div className="factor-progress-bg">
                    <div
                      className={`factor-progress-fill ${factor.impact}`}
                      style={{ width: `${Math.abs(parseInt(factor.weight)) * 2}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm">Feature weights calculated across 128 multi-variate nodes.</p>
            )}
          </div>
        </div>
      </div>

      {/* 5. Academic Disclaimer Banner */}
      <div className="academic-disclaimer-banner">
        <AlertTriangle size={20} className="text-amber-400 shrink-0" />
        <div className="disclaimer-text">
          <strong>Academic Simulation Notice:</strong> The predictive models shown are developed for academic research and educational demonstration (Course: Web Programming). Predictions depict statistical probability envelopes based on historical regression and neural sequence modeling. They are <em>not</em> guaranteed prices or financial investment advice.
        </div>
      </div>
    </div>
  );
};
