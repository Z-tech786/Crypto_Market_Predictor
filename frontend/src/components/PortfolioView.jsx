import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPercent } from '../utils/formatters';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  PieChart,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  Trash2,
  Wallet,
  Sparkles
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PortfolioView = ({ onNavigateToTrading }) => {
  const { cryptos, wallet, executeTrade, addToast } = useCrypto();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState(cryptos[0]?.id || "bitcoin");
  const [addAmount, setAddAmount] = useState("");
  const [addBuyPrice, setAddBuyPrice] = useState("");

  // Calculate market values & P&L for each holding
  let totalCryptoValue = (0);
  let totalCostBasis = (0);

  const holdingsDetailed = wallet.holdings.map((holding) => {
    const coin = cryptos.find((cryptoItem) => cryptoItem.id === holding.coinId) || {
      name: holding.symbol,
      price: holding.avgBuyPrice,
      color: "#38bdf8"
    };

    const currentValue = holding.amount * coin.price;
    const costBasis = holding.amount * holding.avgBuyPrice;
    const profitLoss = (currentValue - costBasis);
    const profitLossPercent = (costBasis > 0) ? ((profitLoss / costBasis) * 100) : (0);

    totalCryptoValue = (totalCryptoValue + currentValue);
    totalCostBasis = (totalCostBasis + costBasis);

    return {
      ...holding,
      color: coin.color || "#38bdf8",
      coinName: coin.name,
      currentPrice: coin.price,
      currentValue,
      costBasis,
      profitLoss,
      profitLossPercent
    };
  });

  const totalPortfolioValue = (wallet.usdtBalance + totalCryptoValue);
  const totalUnrealizedPL = (totalCryptoValue - totalCostBasis);
  const totalUnrealizedPLPercent =
    (totalCostBasis > 0) ? ((totalUnrealizedPL / totalCostBasis) * 100) : (0);

  // Doughnut Chart Data: Cash vs Crypto Holdings
  const chartLabels = ["USDT (Cash)", ...holdingsDetailed.map((holding) => holding.symbol)];
  const chartDataPoints = [wallet.usdtBalance, ...holdingsDetailed.map((holding) => holding.currentValue)];
  const chartColors = ["#10b981", ...holdingsDetailed.map((holding) => holding.color)];

  const doughnutData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataPoints,
        backgroundColor: chartColors,
        borderColor: "#0b0f19",
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const pct = (totalPortfolioValue > 0) ? ((val / totalPortfolioValue) * 100).toFixed(1) : 0;
            return ` ${context.label}: $${val.toLocaleString()} (${pct}%)`;
          }
        }
      },
      legend: {
        position: "right",
        labels: {
          color: "#94a3b8",
          font: { family: "inherit", size: 12 },
          usePointStyle: true,
          pointStyle: "circle"
        }
      }
    }
  };

  const handleAddCustomHolding = (e) => {
    e.preventDefault();
    const numAmt = (parseFloat(addAmount));
    const numPrice = (parseFloat(addBuyPrice));

    if ((!numAmt) || (numAmt <= 0) || (!numPrice) || (numPrice <= 0)) {
      addToast("Please enter valid numeric amounts and prices.", "error");
      return;
    }

    // Execute simulated buy with manual cost
    executeTrade("BUY", selectedCoinId, numAmt, numPrice, "LIMIT", "Portfolio Import");
    setIsAddModalOpen(false);
    setAddAmount("");
    setAddBuyPrice("");
  };

  return (
    <div className="portfolio-page">
      {/* 1. Header Overview Cards */}
      <div className="portfolio-stats-grid">
        <div className="port-stat-card">
          <div className="port-stat-top">
            <span className="port-stat-title">Total Portfolio Value</span>
            <Wallet size={20} className="text-cyan-400" />
          </div>
          <div className="font-mono port-stat-val">{formatUSD(totalPortfolioValue)}</div>
          <div className="port-stat-sub text-muted">
            Includes USDT cash + live crypto valuations
          </div>
        </div>

        <div className="port-stat-card">
          <div className="port-stat-top">
            <span className="port-stat-title">Unrealized P&L (Total)</span>
            {(totalUnrealizedPL >= 0) ? (
              <TrendingUp size={20} className="text-emerald-400" />
            ) : (
              <TrendingDown size={20} className="text-rose-400" />
            )}
          </div>
          <div
            className={`font-mono port-stat-val ${(totalUnrealizedPL >= 0) ? "text-emerald-400" : "text-rose-400"}`}
          >
            {formatUSD(totalUnrealizedPL)}
          </div>
          <div
            className={`font-mono port-stat-sub ${(totalUnrealizedPLPercent >= 0) ? "positive" : "negative"}`}
          >
            {formatPercent(totalUnrealizedPLPercent)} ROI
          </div>
        </div>

        <div className="port-stat-card">
          <div className="port-stat-top">
            <span className="port-stat-title">Available Cash (USDT)</span>
            <DollarSign size={20} className="text-emerald-400" />
          </div>
          <div className="font-mono port-stat-val text-emerald-400">
            {formatUSD(wallet.usdtBalance)}
          </div>
          <div className="port-stat-sub text-muted">Ready for Paper Trading Deployment</div>
        </div>

        <div className="port-stat-card">
          <div className="port-stat-top">
            <span className="port-stat-title">Active Assets</span>
            <PieChart size={20} className="text-purple-400" />
          </div>
          <div className="font-mono port-stat-val">
            {holdingsDetailed.length + ((wallet.usdtBalance > 0) ? 1 : 0)}
          </div>
          <div className="port-stat-sub text-muted">Diversified Portfolio Allocations</div>
        </div>
      </div>

      {/* 2. Middle Row: Asset Allocation Doughnut Chart & Quick Management */}
      <div className="portfolio-middle-row">
        {/* Doughnut Chart Card */}
        <div className="allocation-card">
          <div className="allocation-header">
            <PieChart size={18} className="text-purple-400" />
            <h3 className="allocation-heading">Asset Allocation Distribution</h3>
          </div>
          <div className="doughnut-canvas-wrap" style={{ height: "240px" }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Quick Actions & Rebalancing Card */}
        <div className="quick-portfolio-action-card">
          <h3 className="card-heading">Portfolio Tools & Controls</h3>
          <p className="text-sm text-muted mb-4">
            Manage your academic paper holdings, import initial test positions, or rebalance into cash.
          </p>

          <div className="portfolio-actions-stack">
            <button
              className="btn-add-holding"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusCircle size={16} />
              <span>Add Custom Holding</span>
            </button>

            <button
              className="btn-open-terminal-rebalance"
              onClick={() => onNavigateToTrading(holdingsDetailed[0]?.coinId || "bitcoin")}
            >
              <ArrowUpRight size={16} />
              <span>Open Trading Terminal</span>
            </button>
          </div>

          <div className="portfolio-advice-note">
            <Sparkles size={15} className="text-cyan-400" />
            <span>
              Tip: Diversifying across uncorrelated sectors (Layer 1, DeFi, and Oracles) reduces volatility drawdown.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Holdings Detailed Table */}
      <div className="holdings-table-panel">
        <div className="holdings-table-header">
          <h3 className="table-heading">Simulated Asset Holdings</h3>
          <span className="text-xs text-muted">Auto-refreshed with real-time price feeds</span>
        </div>

        <div className="holdings-table-container">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="text-right">Holdings Amount</th>
                <th className="text-right">Avg Entry Price</th>
                <th className="text-right">Current Price</th>
                <th className="text-right">Total Value</th>
                <th className="text-right">Unrealized P&L</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {(holdingsDetailed.length === 0) ? (
                <tr>
                  <td colSpan="7" className="no-data-cell">
                    Your portfolio currently holds 100% USDT cash. Place trades on the Trading Terminal to build holdings!
                  </td>
                </tr>
              ) : (
                holdingsDetailed.map((item) => {
                  const isProfit = (item.profitLoss >= 0);

                  return (
                    <tr key={item.coinId}>
                      {/* Asset */}
                      <td>
                        <div className="asset-cell">
                          <div
                            className="coin-icon-circle-sm"
                            style={{ backgroundColor: `${item.color}22`, borderColor: item.color }}
                          >
                            <span style={{ color: item.color, fontWeight: "bold" }}>
                              {item.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <span className="asset-name block font-semibold">{item.coinName}</span>
                            <span className="asset-sym text-xs text-muted">{item.symbol}</span>
                          </div>
                        </div>
                      </td>

                      {/* Holding Amount */}
                      <td className="font-mono text-right font-medium">
                        {item.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {item.symbol}
                      </td>

                      {/* Avg Entry Price */}
                      <td className="font-mono text-right text-muted">
                        {formatUSD(item.avgBuyPrice)}
                      </td>

                      {/* Current Spot Price */}
                      <td className="font-mono text-right font-semibold">
                        {formatUSD(item.currentPrice)}
                      </td>

                      {/* Total Value */}
                      <td className="font-mono text-right font-bold">
                        {formatUSD(item.currentValue)}
                      </td>

                      {/* Unrealized P&L */}
                      <td className="font-mono text-right">
                        <span className={`pl-tag ${(isProfit ? "positive" : "negative")}`}>
                          {formatUSD(item.profitLoss)} ({formatPercent(item.profitLossPercent)})
                        </span>
                      </td>

                      {/* Action */}
                      <td className="text-center">
                        <button
                          className="btn-quick-trade-holding"
                          onClick={() => onNavigateToTrading(item.coinId)}
                        >
                          Trade
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

      {/* 4. Add Holding Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="custom-modal-card" onClick={(e) => (e.stopPropagation())}>
            <div className="custom-modal-header">
              <h3 className="modal-title">Add Simulated Asset Holding</h3>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomHolding} className="custom-modal-form">
              <div className="form-group">
                <label className="form-label">Select Cryptocurrency</label>
                <select
                  className="coin-dropdown"
                  value={selectedCoinId}
                  onChange={(e) => {
                    setSelectedCoinId(e.target.value);
                    const c = cryptos.find((cryptoItem) => cryptoItem.id === e.target.value);
                    if (c) setAddBuyPrice(c.price.toString());
                  }}
                >
                  {cryptos.map((cryptoItem) => (
                    <option key={cryptoItem.id} value={cryptoItem.id}>
                      {cryptoItem.name} ({cryptoItem.symbol}) — Current: {formatUSD(cryptoItem.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Holdings Quantity</label>
                <input
                  type="number"
                  step="any"
                  className="trade-input font-mono"
                  placeholder="e.g. 0.5"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Average Purchase Price (USDT)</label>
                <input
                  type="number"
                  step="any"
                  className="trade-input font-mono"
                  placeholder="e.g. 64000"
                  value={addBuyPrice}
                  onChange={(e) => setAddBuyPrice(e.target.value)}
                  required
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save-holding">
                  Add Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
