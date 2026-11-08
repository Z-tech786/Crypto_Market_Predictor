import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CRYPTO_LIST, GLOBAL_METRICS } from '../data/cryptoData';
import { BOT_STRATEGIES, INITIAL_PAPER_WALLET } from '../data/botStrategies';
import { EDUCATION_MODULES } from '../data/educationData';

const CryptoContext = createContext();

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

export const CryptoProvider = ({ children }) => {
  // 1. Live Cryptos State
  const [cryptos, setCryptos] = useState(() => {
    const saved = localStorage.getItem('crypto_market_data');
    return saved ? JSON.parse(saved) : INITIAL_CRYPTO_LIST;
  });
  const [marketDataStatus, setMarketDataStatus] = useState({
    status: 'connecting',
    lastUpdated: null,
    error: null
  });

  const [activeCoinId, setActiveCoinId] = useState('bitcoin');
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('crypto_watchlist');
    return saved ? JSON.parse(saved) : ['bitcoin', 'ethereum', 'solana'];
  });

  // 2. User & Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crypto_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Farhan Ijaz',
          email: 'farhan@crypto.edu',
          role: 'admin', // 'student' | 'trader' | 'admin'
          riskTolerance: 'Moderate',
          studentId: '23L-0568',
          isAuthenticated: true,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
        };
  });

  // 3. Paper Trading Virtual Wallet
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('crypto_paper_wallet');
    return saved ? JSON.parse(saved) : INITIAL_PAPER_WALLET;
  });

  // 4. Bot Strategies
  const [bots, setBots] = useState(() => {
    const saved = localStorage.getItem('crypto_trading_bots');
    return saved ? JSON.parse(saved) : BOT_STRATEGIES;
  });

  // 5. Education Progress
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('crypto_completed_lessons');
    return saved ? JSON.parse(saved) : ['lesson-1'];
  });

  const [quizResults, setQuizResults] = useState(() => {
    const saved = localStorage.getItem('crypto_quiz_results');
    return saved ? JSON.parse(saved) : {};
  });

  // 6. Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('crypto_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('crypto_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('crypto_paper_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('crypto_trading_bots', JSON.stringify(bots));
  }, [bots]);

  useEffect(() => {
    localStorage.setItem('crypto_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('crypto_quiz_results', JSON.stringify(quizResults));
  }, [quizResults]);

  // Sync live spot prices and 24-hour changes from Binance every 30 seconds.
  useEffect(() => {
    let controller;
    const syncPrices = async () => {
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;

      try {
        const symbols = INITIAL_CRYPTO_LIST.map((coin) => `${coin.symbol}USDT`);
        const query = new URLSearchParams({ symbols: JSON.stringify(symbols) });
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?${query}`,
          { signal: requestController.signal, cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error(`Binance returned HTTP ${response.status}`);
        }

        const tickers = await response.json();
        if (!Array.isArray(tickers)) {
          throw new Error('Binance returned an invalid ticker response');
        }

        const liveData = new Map(
          tickers
            .map((ticker) => [
              ticker.symbol,
              {
                price: Number(ticker.lastPrice),
                change24h: Number(ticker.priceChangePercent),
                volume24h: Number(ticker.quoteVolume)
              }
            ])
            .filter(
              ([symbol, data]) =>
                symbol &&
                Number.isFinite(data.price) &&
                data.price > 0 &&
                Number.isFinite(data.change24h) &&
                Number.isFinite(data.volume24h)
            )
        );

        if (symbols.some((symbol) => !liveData.has(symbol))) {
          throw new Error('Binance did not return valid prices for every listed coin');
        }

        setCryptos((previous) =>
          previous.map((coin) => {
            const liveCoin = liveData.get(`${coin.symbol}USDT`);
            if (!liveCoin) return coin;

            return {
              ...coin,
              ...liveCoin,
              lastTickDirection: liveCoin.price >= coin.price ? 'up' : 'down'
            };
          })
        );
        setMarketDataStatus({
          status: 'live',
          lastUpdated: Date.now(),
          error: null
        });
      } catch (error) {
        if (requestController.signal.aborted) return;

        console.error('Unable to sync live cryptocurrency prices:', error);
        setMarketDataStatus((previous) => ({
          ...previous,
          status: 'offline',
          error: error.message
        }));
      }
    };

    syncPrices();
    const interval = setInterval(syncPrices, 30000);

    return () => {
      clearInterval(interval);
      controller?.abort();
    };
  }, []);

  // Bot execution simulation tick
  useEffect(() => {
    const activeBots = bots.filter((b) => b.active);
    if (activeBots.length === 0) return;

    const botInterval = setInterval(() => {
      activeBots.forEach((bot) => {
        // Find targeted coin
        const pairSymbol = bot.targetPair.split('/')[0];
        const coin = cryptos.find((c) => c.symbol === pairSymbol);
        if (!coin) return;

        // Simulate execution chance
        const willExecute = Math.random() < 0.25; // 25% chance per interval
        if (willExecute) {
          const isBuy = Math.random() > 0.45;
          const tradeAmount = Math.max(0.01, Math.round((500 / coin.price) * 100) / 100);
          const totalCost = tradeAmount * coin.price;

          if (isBuy && wallet.usdtBalance >= totalCost) {
            executeTrade('BUY', coin.id, tradeAmount, coin.price, 'MARKET', bot.name);
            addToast(`🤖 ${bot.name} executed BUY order for ${tradeAmount} ${coin.symbol}`, 'success');
          } else if (!isBuy) {
            const holding = wallet.holdings.find((h) => h.coinId === coin.id);
            if (holding && holding.amount >= tradeAmount) {
              executeTrade('SELL', coin.id, tradeAmount, coin.price, 'MARKET', bot.name);
              addToast(`🤖 ${bot.name} executed SELL order for ${tradeAmount} ${coin.symbol}`, 'info');
            }
          }
        }
      });
    }, 12000);

    return () => clearInterval(botInterval);
  }, [bots, cryptos, wallet]);

  // Watchlist toggle
  const toggleWatchlist = (coinId) => {
    setWatchlist((prev) => {
      const exists = prev.includes(coinId);
      const updated = exists ? prev.filter((id) => id !== coinId) : [...prev, coinId];
      addToast(
        exists ? 'Removed from watchlist' : 'Added to watchlist',
        exists ? 'info' : 'success'
      );
      return updated;
    });
  };

  // Trade Execution
  const executeTrade = (type, coinId, amount, price, orderType = 'MARKET', strategy = 'Manual') => {
    const numAmount = Number(amount);
    const numPrice = Number(price);
    const totalCost = numAmount * numPrice;

    if (numAmount <= 0 || numPrice <= 0) {
      addToast('Please enter a valid amount and price.', 'error');
      return false;
    }

    const coin = cryptos.find((c) => c.id === coinId);
    if (!coin) return false;

    if (type === 'BUY') {
      if (wallet.usdtBalance < totalCost) {
        addToast(`Insufficient USDT balance! Needed: $${totalCost.toFixed(2)}, Available: $${wallet.usdtBalance.toFixed(2)}`, 'error');
        return false;
      }

      setWallet((prev) => {
        const existingHoldingIndex = prev.holdings.findIndex((h) => h.coinId === coinId);
        let updatedHoldings = [...prev.holdings];

        if (existingHoldingIndex >= 0) {
          const current = updatedHoldings[existingHoldingIndex];
          const newAmount = current.amount + numAmount;
          const newAvgPrice = (current.amount * current.avgBuyPrice + totalCost) / newAmount;
          updatedHoldings[existingHoldingIndex] = {
            ...current,
            amount: newAmount,
            avgBuyPrice: newAvgPrice
          };
        } else {
          updatedHoldings.push({
            coinId,
            symbol: coin.symbol,
            amount: numAmount,
            avgBuyPrice: numPrice
          });
        }

        const newTrade = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'BUY',
          symbol: coin.symbol,
          amount: numAmount,
          price: numPrice,
          total: totalCost,
          timestamp: new Date().toISOString(),
          status: 'FILLED',
          orderType,
          strategy
        };

        return {
          ...prev,
          usdtBalance: Math.max(0, prev.usdtBalance - totalCost),
          holdings: updatedHoldings,
          tradeHistory: [newTrade, ...prev.tradeHistory]
        };
      });

      addToast(`Successfully bought ${numAmount} ${coin.symbol} at $${numPrice.toLocaleString()}!`, 'success');
      return true;
    } else if (type === 'SELL') {
      const holding = wallet.holdings.find((h) => h.coinId === coinId);
      if (!holding || holding.amount < numAmount) {
        addToast(`Insufficient ${coin.symbol} holdings to sell!`, 'error');
        return false;
      }

      setWallet((prev) => {
        let updatedHoldings = prev.holdings
          .map((h) => {
            if (h.coinId === coinId) {
              const remaining = h.amount - numAmount;
              return remaining > 0 ? { ...h, amount: remaining } : null;
            }
            return h;
          })
          .filter(Boolean);

        const newTrade = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'SELL',
          symbol: coin.symbol,
          amount: numAmount,
          price: numPrice,
          total: totalCost,
          timestamp: new Date().toISOString(),
          status: 'FILLED',
          orderType,
          strategy
        };

        return {
          ...prev,
          usdtBalance: prev.usdtBalance + totalCost,
          holdings: updatedHoldings,
          tradeHistory: [newTrade, ...prev.tradeHistory]
        };
      });

      addToast(`Successfully sold ${numAmount} ${coin.symbol} for $${totalCost.toLocaleString()}!`, 'success');
      return true;
    }
  };

  const resetWallet = () => {
    setWallet({
      usdtBalance: 10000.0,
      holdings: [],
      tradeHistory: []
    });
    addToast('Virtual wallet reset to $10,000.00 USDT initial balance.', 'info');
  };

  const toggleBot = (botId) => {
    setBots((prev) =>
      prev.map((b) => {
        if (b.id === botId) {
          const nextState = !b.active;
          addToast(
            `${b.name} is now ${nextState ? 'ACTIVE ⚡' : 'PAUSED ⏸️'}`,
            nextState ? 'success' : 'info'
          );
          return { ...b, active: nextState };
        }
        return b;
      })
    );
  };

  const markLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
      addToast('🎉 Lesson completed! +50 XP earned.', 'success');
    }
  };

  const saveQuizScore = (quizId, score, passed) => {
    setQuizResults((prev) => ({
      ...prev,
      [quizId]: { score, passed, timestamp: new Date().toISOString() }
    }));
  };

  // Switch role between student, trader, admin
  const switchRole = (newRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole
    }));
    addToast(`Role switched to ${newRole.toUpperCase()} mode.`, 'info');
  };

  // Active Coin helper
  const activeCoin = cryptos.find((c) => c.id === activeCoinId) || cryptos[0];

  return (
    <CryptoContext.Provider
      value={{
        cryptos,
        marketDataStatus,
        globalMetrics: GLOBAL_METRICS,
        activeCoin,
        setActiveCoinId,
        watchlist,
        toggleWatchlist,
        user,
        setUser,
        switchRole,
        wallet,
        executeTrade,
        resetWallet,
        bots,
        toggleBot,
        completedLessons,
        markLessonComplete,
        quizResults,
        saveQuizScore,
        toasts,
        addToast
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
