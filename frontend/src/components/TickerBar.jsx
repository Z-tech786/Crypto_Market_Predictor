import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPercent } from '../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerBar = () => {
  const { cryptos, setActiveCoinId } = useCrypto();

  return (
    <div className="ticker-bar-wrapper">
      <div className="ticker-label">
        <span className="live-indicator"></span> LIVE FEEDS
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
