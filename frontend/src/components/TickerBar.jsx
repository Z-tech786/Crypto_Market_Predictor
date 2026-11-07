import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPercent } from '../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerBar = () => {
  const { cryptos, setActiveCoinId, marketDataStatus } = useCrypto();
  const statusLabel = {
    connecting: 'CONNECTING',
    live: 'LIVE · BINANCE',
    offline: 'OFFLINE · RETRYING'
  }[marketDataStatus.status];
  const lastSynced = marketDataStatus.lastUpdated
    ? `Last successful sync: ${new Date(marketDataStatus.lastUpdated).toLocaleTimeString()}. `
    : '';
  const statusTitle =
    lastSynced +
    (marketDataStatus.error ||
      (marketDataStatus.status === 'live'
        ? 'Prices are syncing from Binance.'
        : 'Connecting to Binance live market data.'));

  return (
    <div className="ticker-bar-wrapper">
      <div
        className={`ticker-label ticker-label-${marketDataStatus.status}`}
        title={statusTitle}
        aria-live="polite"
      >
        <span className={`live-indicator live-indicator-${marketDataStatus.status}`}></span>
        {statusLabel}
      </div>
      <div className="ticker-track">
        <div className="ticker-content">
          {cryptos.concat(cryptos).map((coin, index) => {
            const isUp = coin.change24h >= 0;
            return (
              <div
                key={`${coin.id}-${index}`}
                className="ticker-item"
                onClick={() => setActiveCoinId(coin.id)}
                title={`Click to view ${coin.name}`}
              >
                <span className="ticker-symbol">{coin.symbol}</span>
                <span className="ticker-price">{formatUSD(coin.price)}</span>
                <span className={`ticker-change ${isUp ? 'positive' : 'negative'}`}>
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {formatPercent(coin.change24h)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
