import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPercent } from '../utils/formatters';
import {
  Wallet,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Sliders,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  ShieldAlert,
  Percent
} from 'lucide-react';

export const SimulatedTrading = () => {
  const {
    cryptos,
    activeCoin,
    setActiveCoinId,
    wallet,
    executeTrade,
    resetWallet,
    bots,
    toggleBot
  } = useCrypto();

  const [tradeType, setTradeType] = useState('BUY'); // 'BUY' | 'SELL'
  const [orderType, setOrderType] = useState('MARKET'); // 'MARKET' | 'LIMIT'
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState(activeCoin.price.toString());

  // Find user's current holding for active coin
  const currentHolding = wallet.holdings.find((h) => h.coinId === activeCoin.id);
  const holdingAmount = currentHolding ? currentHolding.amount : 0;

  // Selected execution price
  const executionPrice = orderType === 'MARKET' ? activeCoin.price : Number(limitPrice);
  const numAmount = Number(amount);
  const isPriceValid = Number.isFinite(executionPrice) && executionPrice > 0;
  const maxBuyAmount = isPriceValid
    ? wallet.usdtBalance / (executionPrice * 1.001)
    : 0;
  const orderValue = numAmount * executionPrice;
  const simulatedFee = orderValue * 0.001; // 0.1% simulated exchange fee
  const totalCost = tradeType === 'BUY' ? orderValue + simulatedFee : orderValue - simulatedFee;
  const isAmountValid = Number.isFinite(numAmount) && numAmount > 0;
  const hasSufficientBalance = totalCost <= wallet.usdtBalance;
  const hasSufficientHolding = numAmount <= holdingAmount;
  const canExecuteOrder =
    isPriceValid &&
    isAmountValid &&
    (tradeType === 'BUY' ? hasSufficientBalance : hasSufficientHolding);
  const orderValidationMessage = !isPriceValid && orderType === 'LIMIT'
    ? 'Enter a limit price greater than zero.'
    : amount && !isAmountValid
      ? 'Enter an amount greater than zero.'
      : tradeType === 'BUY' && isAmountValid && !hasSufficientBalance
        ? 'This order exceeds your available USDT balance.'
        : tradeType === 'SELL' && isAmountValid && !hasSufficientHolding
          ? `You only have ${holdingAmount.toFixed(4)} ${activeCoin.symbol} available.`
          : '';

  // Quick percentage buttons
  const handleQuickPercent = (pct) => {
    if (tradeType === 'BUY') {
      if (!isPriceValid) return;
      const availableFunds = wallet.usdtBalance * pct;
      const calculatedAmount = availableFunds / (executionPrice * 1.001);
      setAmount((Math.floor(calculatedAmount * 10000) / 10000).toString());
    } else {
      const calculatedAmount = holdingAmount * pct;
      setAmount((Math.floor(calculatedAmount * 10000) / 10000).toString());
    }
  };

  const handleExecute = (e) => {
    e.preventDefault();
    if (!canExecuteOrder) return;

    const success = executeTrade(
      tradeType,
      activeCoin.id,
      numAmount,
      executionPrice,
      orderType,
      'Manual Trader'
    );

    if (success) {
      setAmount('');
    }
  };

  return (
    <div className="trading-page">
      {/* 1. Virtual Wallet Header Banner */}
      <div className="virtual-wallet-banner">
        <div className="wallet-banner-left">
          <div className="wallet-icon-box">
            <Wallet size={24} className="text-emerald-400" />
          </div>
          <div>
            <div className="wallet-title-row">
              <h2 className="wallet-banner-heading">Simulated Paper Trading Terminal</h2>
              <span className="paper-badge">Risk-Free Environment</span>
            </div>
            <p className="wallet-banner-sub">
              Execute live orders against real-time market feeds using $10,000 virtual USDT capital.
            </p>
          </div>
        </div>

        <div className="wallet-banner-right">
          <div className="wallet-stat-group">
            <span className="stat-label">Available USDT</span>
            <span className="stat-val text-emerald-400">{formatUSD(wallet.usdtBalance)}</span>
          </div>

          <button
            className="btn-reset-wallet"
            onClick={resetWallet}
            title="Reset paper wallet balance to initial $10,000"
          >
            <RotateCcw size={15} />
            <span>Reset Balance</span>
          </button>
        </div>
      </div>

      {/* 2. Main Order Terminal Grid */}
      <div className="terminal-grid">
        {/* Left Column: Order Execution Form */}
        <div className="order-form-panel">
          {/* Asset Selection & Spot Price Header */}
          <div className="order-asset-header">
            <div className="order-coin-select">
              <label className="text-xs text-muted block mb-1">Trading Asset</label>
              <select
                className="coin-dropdown"
                value={activeCoin.id}
                onChange={(e) => {
                  setActiveCoinId(e.target.value);
                  const selected = cryptos.find((c) => c.id === e.target.value);
                  if (selected) setLimitPrice(selected.price.toString());
                }}
              >
                {cryptos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.symbol} / USDT — {formatUSD(c.price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="spot-price-tag">
              <span className="text-xs text-muted">Current Spot</span>
              <span className="spot-val font-mono">{formatUSD(activeCoin.price)}</span>
            </div>
          </div>

          {/* Buy / Sell Tabs */}
          <div className="buy-sell-toggle-tabs">
            <button
              className={`bs-tab buy-tab ${tradeType === 'BUY' ? 'active' : ''}`}
              onClick={() => setTradeType('BUY')}
            >
              Buy {activeCoin.symbol}
            </button>
            <button
              className={`bs-tab sell-tab ${tradeType === 'SELL' ? 'active' : ''}`}
              onClick={() => setTradeType('SELL')}
            >
              Sell {activeCoin.symbol}
            </button>
          </div>

          {/* Order Type: Market vs Limit */}
          <div className="order-type-selector">
            <button
              className={`order-type-btn ${orderType === 'MARKET' ? 'active' : ''}`}
              onClick={() => setOrderType('MARKET')}
            >
              Market Order
            </button>
            <button
              className={`order-type-btn ${orderType === 'LIMIT' ? 'active' : ''}`}
              onClick={() => setOrderType('LIMIT')}
            >
              Limit Order
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleExecute} className="trade-input-form">
            {orderType === 'LIMIT' && (
              <div className="form-group">
                <label className="form-label">
                  <span>Limit Price (USDT)</span>
                  <span className="text-muted text-xs">Target Entry</span>
                </label>
                <div className="input-with-addon">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    className="trade-input font-mono"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder="Enter limit price"
                    required
                  />
                  <span className="input-addon">USDT</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Amount ({activeCoin.symbol})</label>
                <span className="text-xs text-muted">
                  {tradeType === 'BUY'
                    ? `Max: ${maxBuyAmount.toFixed(4)} ${activeCoin.symbol}`
                    : `Available: ${holdingAmount.toFixed(4)} ${activeCoin.symbol}`}
                </span>
              </div>
              <div className="input-with-addon">
                <input
                  type="number"
                  step="any"
                  min="0"
                  className="trade-input font-mono"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <span className="input-addon">{activeCoin.symbol}</span>
              </div>
            </div>
            {orderValidationMessage && (
              <p className="order-validation-message" role="status">
                {orderValidationMessage}
              </p>
            )}

            {/* Percentage Chips */}
            <div className="percent-chips-row">
              <button
                type="button"
                className="pct-chip"
                disabled={(tradeType === 'BUY' && !isPriceValid) || (tradeType === 'SELL' && holdingAmount <= 0)}
                onClick={() => handleQuickPercent(0.25)}
              >
                25%
              </button>
              <button
                type="button"
                className="pct-chip"
                disabled={(tradeType === 'BUY' && !isPriceValid) || (tradeType === 'SELL' && holdingAmount <= 0)}
                onClick={() => handleQuickPercent(0.5)}
              >
                50%
              </button>
              <button
                type="button"
                className="pct-chip"
                disabled={(tradeType === 'BUY' && !isPriceValid) || (tradeType === 'SELL' && holdingAmount <= 0)}
                onClick={() => handleQuickPercent(0.75)}
              >
                75%
              </button>
              <button
                type="button"
                className="pct-chip"
                disabled={(tradeType === 'BUY' && !isPriceValid) || (tradeType === 'SELL' && holdingAmount <= 0)}
                onClick={() => handleQuickPercent(1.0)}
              >
                100% Max
              </button>
            </div>

            {/* Order Cost Breakdown */}
            <div className="order-summary-box">
              <div className="summary-row">
                <span className="text-muted">Order Value:</span>
                <span className="font-mono">{formatUSD(orderValue)}</span>
              </div>
              <div className="summary-row">
                <span className="text-muted">Simulated Fee (0.1%):</span>
                <span className="font-mono">{formatUSD(simulatedFee)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total {tradeType === 'BUY' ? 'Payment' : 'Proceeds'}:</span>
                <span className="font-mono font-bold text-white">{formatUSD(totalCost)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn-execute-order ${tradeType === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
              disabled={!canExecuteOrder}
            >
              {tradeType === 'BUY' ? `Buy ${activeCoin.symbol}` : `Sell ${activeCoin.symbol}`} (Paper Order)
            </button>
          </form>
        </div>

        {/* Right Column: AI Automated Trading Bot Strategies */}
        <div className="bots-panel">
          <div className="bots-panel-header">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-cyan-400" />
              <h3 className="bots-heading">AI Algorithmic Bot Strategies</h3>
            </div>
            <span className="text-xs text-muted">Autonomous Simulation</span>
          </div>
          <p className="bots-desc">
            Toggle automated bot execution. Activated bots monitor real-time prices and indicators to execute simulated orders automatically into your paper wallet.
          </p>

          <div className="bot-cards-grid">
            {bots.map((bot) => (
              <div key={bot.id} className={`bot-card ${bot.active ? 'active-bot' : ''}`}>
                <div className="bot-card-top">
                  <div className="bot-info-head">
                    <span className="bot-name">{bot.name}</span>
                    <span className={`risk-badge risk-${bot.riskLevel.toLowerCase()}`}>
                      {bot.riskLevel} Risk
                    </span>
                  </div>

                  {/* Switch */}
                  <label className="bot-switch">
                    <input
                      type="checkbox"
                      checked={bot.active}
                      onChange={() => toggleBot(bot.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <p className="bot-card-desc">{bot.description}</p>

                <div className="bot-metrics-row">
                  <div className="bot-sub-metric">
                    <span className="text-muted text-xs">Target Pair:</span>
                    <span className="font-mono font-semibold">{bot.targetPair}</span>
                  </div>
                  <div className="bot-sub-metric">
                    <span className="text-muted text-xs">Simulated Win Rate:</span>
                    <span className="font-mono font-semibold text-emerald-400">{bot.winRate}</span>
                  </div>
                  <div className="bot-sub-metric">
                    <span className="text-muted text-xs">Executed Trades:</span>
                    <span className="font-mono font-semibold">{bot.tradesCount}</span>
                  </div>
                </div>

                <div className="bot-status-tag">
                  <span className={`status-pulse-dot ${bot.active ? 'active' : ''}`}></span>
                  <span>{bot.active ? 'Actively Monitoring Market Feeds' : 'Paused'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Paper Trading History Table */}
      <div className="trade-history-panel">
        <div className="history-header">
          <Clock size={18} className="text-blue-400" />
          <h3 className="history-heading">Simulated Order & Execution History</h3>
        </div>

        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Time</th>
                <th>Type</th>
                <th>Asset</th>
                <th className="text-right">Price</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Total (USDT)</th>
                <th>Strategy</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {wallet.tradeHistory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data-cell">
                    No simulated orders executed yet. Place an order or activate an AI bot strategy above!
                  </td>
                </tr>
              ) : (
                wallet.tradeHistory.map((trade) => {
                  const isBuy = trade.type === 'BUY';
                  return (
                    <tr key={trade.id}>
                      <td className="font-mono text-xs text-muted">{trade.id}</td>
                      <td className="text-xs text-muted">
                        {new Date(trade.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td>
                        <span className={`order-badge ${isBuy ? 'buy-badge' : 'sell-badge'}`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="font-bold">{trade.symbol}</td>
                      <td className="text-right font-mono">{formatUSD(trade.price)}</td>
                      <td className="text-right font-mono">{trade.amount}</td>
                      <td className="text-right font-mono">{formatUSD(trade.total)}</td>
                      <td>
                        <span className="strategy-tag">{trade.strategy}</span>
                      </td>
                      <td>
                        <span className="status-badge filled">FILLED</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
