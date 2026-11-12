import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_CRYPTO_LIST, GLOBAL_METRICS } from '../data/cryptoData';
import { BOT_STRATEGIES, INITIAL_PAPER_WALLET } from '../data/botStrategies';
import { apiRequest } from '../utils/api';

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
    const savedToken = localStorage.getItem('crypto_auth_token');
    const saved = localStorage.getItem('crypto_user');
    return savedToken && saved
      ? JSON.parse(saved)
      : {
          name: 'Guest User',
          email: '',
          role: 'student',
          riskTolerance: 'Moderate',
          studentId: '',
          isAuthenticated: false
        };
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('crypto_auth_token'));
  const [accountDataLoaded, setAccountDataLoaded] = useState(false);

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

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('crypto_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('crypto_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('crypto_auth_token', authToken);
    } else {
      localStorage.removeItem('crypto_auth_token');
    }
  }, [authToken, addToast]);

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

  useEffect(() => {
    if (!authToken) {
      setAccountDataLoaded(true);
      return;
    }

    let active = true;
    setAccountDataLoaded(false);
    Promise.all([
      apiRequest('/auth/me', { token: authToken }),
      apiRequest('/portfolio', { token: authToken }),
      apiRequest('/watchlist', { token: authToken }),
      apiRequest('/progress', { token: authToken })
    ])
      .then(([account, savedWallet, savedWatchlist, progress]) => {
        if (!active) return;
        setUser(account.user);
        setWallet(savedWallet);
        setBots((current) =>
          current.map((bot) => ({
            ...bot,
            active: savedWallet.bots?.find((savedBot) => savedBot.id === bot.id)?.active ?? false
          }))
        );
        setWatchlist(savedWatchlist.watchlist);
        setCompletedLessons(progress.completedLessons);
        setQuizResults(progress.quizResults);
      })
      .catch((error) => {
        if (!active) return;
        console.error('Unable to load account data:', error);
        setAuthToken(null);
        setUser({
          name: 'Guest User',
          email: '',
          studentId: '',
          role: 'student',
          riskTolerance: 'Moderate',
          isAuthenticated: false
        });
        addToast(error.message, 'error');
      })
      .finally(() => {
        if (active) setAccountDataLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [authToken, addToast]);

  useEffect(() => {
    if (!authToken || !accountDataLoaded) return;
    apiRequest('/watchlist', {
      method: 'PUT',
      token: authToken,
      body: { watchlist }
    }).catch((error) => {
      console.error('Unable to save watchlist:', error);
      addToast(error.message, 'error');
    });
  }, [watchlist, authToken, accountDataLoaded, addToast]);

  useEffect(() => {
    if (!authToken || !accountDataLoaded) return;
    apiRequest('/progress', {
      method: 'PUT',
      token: authToken,
      body: { completedLessons, quizResults }
    }).catch((error) => {
      console.error('Unable to save learning progress:', error);
      addToast(error.message, 'error');
    });
  }, [completedLessons, quizResults, authToken, accountDataLoaded, addToast]);

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
  const executeTrade = useCallback((type, coinId, amount, price, orderType = 'MARKET', strategy = 'Manual') => {
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

      if (authToken) {
        apiRequest('/portfolio/trades', {
          method: 'POST',
          token: authToken,
          body: { type, coinId, symbol: coin.symbol, amount: numAmount, price: numPrice, orderType, strategy }
        })
          .then(setWallet)
          .catch((error) => {
            console.error('Unable to save paper trade:', error);
            addToast(error.message, 'error');
            apiRequest('/portfolio', { token: authToken }).then(setWallet).catch((refreshError) => {
              console.error('Unable to refresh paper wallet:', refreshError);
            });
          });
      }

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

      if (authToken) {
        apiRequest('/portfolio/trades', {
          method: 'POST',
          token: authToken,
          body: { type, coinId, symbol: coin.symbol, amount: numAmount, price: numPrice, orderType, strategy }
        })
          .then(setWallet)
          .catch((error) => {
            console.error('Unable to save paper trade:', error);
            addToast(error.message, 'error');
            apiRequest('/portfolio', { token: authToken }).then(setWallet).catch((refreshError) => {
              console.error('Unable to refresh paper wallet:', refreshError);
            });
          });
      }

      addToast(`Successfully sold ${numAmount} ${coin.symbol} for $${totalCost.toLocaleString()}!`, 'success');
      return true;
    }
  }, [authToken, cryptos, wallet, addToast]);

  // Bot execution simulation tick
  useEffect(() => {
    const activeBots = bots.filter((b) => b.active);
    if (activeBots.length === 0) return;

    const botInterval = setInterval(() => {
      activeBots.forEach((bot) => {
        const pairSymbol = bot.targetPair.split('/')[0];
        const coin = cryptos.find((c) => c.symbol === pairSymbol);
        if (!coin) return;

        const willExecute = Math.random() < 0.25;
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
  }, [bots, cryptos, wallet, executeTrade, addToast]);

  const resetWallet = () => {
    setWallet({
      usdtBalance: 10000.0,
      holdings: [],
      tradeHistory: []
    });
    if (authToken) {
      apiRequest('/portfolio/reset', { method: 'POST', token: authToken })
        .then(setWallet)
        .catch((error) => {
          console.error('Unable to reset paper wallet:', error);
          addToast(error.message, 'error');
        });
    }
    addToast('Virtual wallet reset to $10,000.00 USDT initial balance.', 'info');
  };

  const toggleBot = (botId) => {
    const bot = bots.find((item) => item.id === botId);
    if (!bot) return;
    const nextState = !bot.active;
    setBots((previous) =>
      previous.map((item) => item.id === botId ? { ...item, active: nextState } : item)
    );
    if (authToken) {
      apiRequest(`/portfolio/bots/${botId}`, {
        method: 'PATCH',
        token: authToken,
        body: { active: nextState }
      }).catch((error) => {
        console.error('Unable to save bot state:', error);
        addToast(error.message, 'error');
      });
    }
    addToast(
      `${bot.name} is now ${nextState ? 'ACTIVE ⚡' : 'PAUSED ⏸️'}`,
      nextState ? 'success' : 'info'
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

  const authenticate = async (mode, credentials) => {
    const response = await apiRequest(`/auth/${mode}`, {
      method: 'POST',
      body: credentials
    });
    setAuthToken(response.token);
    setUser(response.user);
    setAccountDataLoaded(false);
    return response.user;
  };

  const updateRiskTolerance = async (riskTolerance) => {
    if (authToken) {
      const response = await apiRequest('/auth/profile', {
        method: 'PATCH',
        token: authToken,
        body: { riskTolerance }
      });
      setUser(response.user);
      return;
    }
    setUser((previous) => ({ ...previous, riskTolerance }));
  };

  const logout = () => {
    setAuthToken(null);
    setAccountDataLoaded(true);
    setUser({
      name: 'Guest User',
      email: '',
      studentId: '',
      role: 'student',
      riskTolerance: 'Moderate',
      isAuthenticated: false
    });
    setWatchlist(['bitcoin', 'ethereum', 'solana']);
    setWallet(INITIAL_PAPER_WALLET);
    setBots(BOT_STRATEGIES);
    setCompletedLessons(['lesson-1']);
    setQuizResults({});
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
        authenticate,
        updateRiskTolerance,
        logout,
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
