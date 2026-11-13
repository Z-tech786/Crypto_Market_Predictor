import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPercent } from '../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerBar = () => {
  const { cryptos = [], setActiveCoinId, marketDataStatus } = useCrypto();

  const status = marketDataStatus?.status || 'live';
  const statusLabel = {
    connecting: 'CONNECTING',
    live: 'LIVE · API',
    offline: 'OFFLINE · RETRYING'
  }[status] || 'LIVE · FEEDS';

  const lastSynced = marketDataStatus?.lastUpdated
    ? `Last successful sync: ${new Date(marketDataStatus.lastUpdated).toLocaleTimeString()}. `
    : '';

  const statusTitle =
    lastSynced +
<<<<<<< Updated upstream
    (marketDataStatus.error ||
      (marketDataStatus.status === 'live'
        ? 'Live prices and history are supplied by the backend market API.'
        : 'Connecting to the backend market API.'));
=======
    (marketDataStatus?.error ||
      (status === 'live'
        ? 'Prices are syncing from Binance & Backend.'
        : 'Connecting to live market data.'));
>>>>>>> Stashed changes

  return (
    <div className="ticker-bar-wrapper">
      <div
        className={`ticker-label ticker-label-${status}`}
        title={statusTitle}
        aria-live="polite"
      >
        <span className={`live-indicator live-indicator-${status}`}></span>
        {statusLabel}
      </div>
      <div className="ticker-track">
        <div className="ticker-content">
          {cryptos.concat(cryptos).map((coin, index) => {
            const isUp = (coin.change24h || 0) >= 0;
            const coinId = coin.id || coin.coinId || coin.symbol.toLowerCase();

            return (
              <button
                type="button"
                key={`${coinId}-${index}`}
                className="ticker-item"
                onClick={() => setActiveCoinId(coinId)}
                title={`Click to view ${coin.name}`}
                aria-label={`${coin.name}, ${formatUSD(coin.price)}, ${formatPercent(coin.change24h)} in 24 hours. Select to view.`}
              >
                <span className="ticker-symbol">{coin.symbol}</span>
                <span className="ticker-price">{formatUSD(coin.price)}</span>
                <span className={`ticker-change ${isUp ? 'positive' : 'negative'}`}>
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {formatPercent(coin.change24h)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
