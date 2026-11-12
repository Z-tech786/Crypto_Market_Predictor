import { Router } from 'express';

export const marketRouter = Router();

const allowedSymbols = new Set(['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX', 'LINK']);
const circulatingSupplies = {
  BTC: 19770000,
  ETH: 120070000,
  SOL: 467200000,
  BNB: 153850000,
  XRP: 56380000000,
  ADA: 35680000000,
  AVAX: 404000000,
  LINK: 608000000
};
const tickerCache = new Map();
const predictionCache = new Map();
const TICKER_TTL_MS = 30_000;
const PREDICTION_TTL_MS = 5 * 60_000;

class MarketProviderError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 502;
  }
}

async function fetchBinance(path) {
  let response;
  try {
    response = await fetch(`https://api.binance.com/api/v3${path}`, {
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: 'application/json' }
    });
  } catch {
    throw new MarketProviderError('Market data provider is unavailable. Please try again.');
  }

  if (!response.ok) {
    throw new MarketProviderError(`Market data provider returned HTTP ${response.status}.`);
  }

  try {
    return await response.json();
  } catch {
    throw new MarketProviderError('Market data provider returned an invalid response.');
  }
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function movingAverage(values, period) {
  return values.length >= period ? average(values.slice(-period)) : null;
}

function exponentialMovingAverage(values, period) {
  if (values.length < period) return null;
  let result = average(values.slice(0, period));
  const smoothing = 2 / (period + 1);
  for (const value of values.slice(period)) {
    result = value * smoothing + result * (1 - smoothing);
  }
  return result;
}

function linearRegressionSlope(values) {
  const logs = values.map(Math.log);
  const xMean = (logs.length - 1) / 2;
  const yMean = average(logs);
  const numerator = logs.reduce(
    (sum, value, index) => sum + (index - xMean) * (value - yMean),
    0
  );
  const denominator = logs.reduce(
    (sum, _value, index) => sum + (index - xMean) ** 2,
    0
  );
  return denominator ? numerator / denominator : 0;
}

function relativeStrengthIndex(closes) {
  const changes = closes.slice(-15).slice(1).map((price, index) => price - closes.slice(-15)[index]);
  const gains = changes.filter((change) => change > 0);
  const losses = changes.filter((change) => change < 0).map(Math.abs);
  const averageGain = gains.length ? average(gains) : 0;
  const averageLoss = losses.length ? average(losses) : 0;
  if (averageLoss === 0) return 100;
  return 100 - 100 / (1 + averageGain / averageLoss);
}

function createPrediction(symbol, rows) {
  const closes = rows
    .map((row) => Number(row[4]))
    .filter((close) => Number.isFinite(close) && close > 0);
  if (closes.length < 50) {
    throw new MarketProviderError('Not enough historical market data to create a forecast.');
  }

  const currentPrice = closes[closes.length - 1];
  const returns = closes.slice(1).map((close, index) => Math.log(close / closes[index]));
  const recentReturns = returns.slice(-30);
  const meanReturn = average(recentReturns);
  const volatility = Math.sqrt(
    average(recentReturns.map((value) => (value - meanReturn) ** 2))
  );
  const slope = Math.max(-0.02, Math.min(0.02, linearRegressionSlope(closes)));
  const projectedPrice = (days) => currentPrice * Math.exp(slope * days);
  const target24h = projectedPrice(1);
  const target7d = projectedPrice(7);
  const trendPercent = (target7d / currentPrice - 1) * 100;
  const trend = trendPercent > 3
    ? 'Strong Bullish'
    : trendPercent > 0.5
      ? 'Bullish'
      : trendPercent < -3
        ? 'Strong Bearish'
        : trendPercent < -0.5
          ? 'Bearish'
          : 'Neutral';
  const uncertainty = 1.96 * volatility * Math.sqrt(7);
  const confidence = Math.round(Math.max(50, Math.min(90, 90 - volatility * 1000)) * 10) / 10;

  const macdValues = [];
  for (let index = 25; index < closes.length; index += 1) {
    const history = closes.slice(0, index + 1);
    macdValues.push(
      exponentialMovingAverage(history, 12) - exponentialMovingAverage(history, 26)
    );
  }
  const macd = macdValues[macdValues.length - 1] || 0;
  const signal = exponentialMovingAverage(macdValues, 9) ?? macd;
  const rsi = relativeStrengthIndex(closes);
  const bollingerWindow = closes.slice(-20);
  const bollingerMean = average(bollingerWindow);
  const bollingerDeviation = Math.sqrt(
    average(bollingerWindow.map((close) => (close - bollingerMean) ** 2))
  );
  const trendWeight = Math.abs(trendPercent);
  const volatilityWeight = volatility * Math.sqrt(7) * 100;
  const momentumWeight = Math.abs(rsi - 50);

  return {
    symbol,
    currentPrice,
    updatedAt: new Date().toISOString(),
    model: 'Historical linear-regression baseline',
    history7d: closes.slice(-7),
    predictionSeries7d: Array.from({ length: 7 }, (_, day) => projectedPrice(day)),
    predictionUpper7d: Array.from(
      { length: 7 },
      (_, day) => projectedPrice(day) * Math.exp(1.96 * volatility * Math.sqrt(day))
    ),
    predictionLower7d: Array.from(
      { length: 7 },
      (_, day) => projectedPrice(day) * Math.exp(-1.96 * volatility * Math.sqrt(day))
    ),
    rsi: Math.round(rsi * 10) / 10,
    macd: Math.round(macd * 10000) / 10000,
    signal: Math.round(signal * 10000) / 10000,
    sma20: movingAverage(closes, 20),
    sma50: movingAverage(closes, 50),
    sma200: movingAverage(closes, 200),
    bollingerUpper: bollingerMean + 2 * bollingerDeviation,
    bollingerLower: bollingerMean - 2 * bollingerDeviation,
    aiPrediction: {
      trend,
      confidence,
      target24h,
      target7d,
      target30d: projectedPrice(30),
      target90d: projectedPrice(90),
      upperBound7d: target7d * Math.exp(uncertainty),
      lowerBound7d: target7d * Math.exp(-uncertainty),
      factors: [
        {
          name: '30-day price trend',
          weight: `${trendPercent >= 0 ? '+' : ''}${trendPercent.toFixed(2)}%`,
          impact: trendPercent >= 0 ? 'positive' : 'negative'
        },
        {
          name: 'Recent market volatility',
          weight: `-${volatilityWeight.toFixed(2)}%`,
          impact: 'negative'
        },
        {
          name: '14-day relative strength',
          weight: `${rsi >= 50 ? '+' : '-'}${momentumWeight.toFixed(1)}%`,
          impact: rsi >= 50 ? 'positive' : 'negative'
        }
      ]
    }
  };
}

marketRouter.get('/tickers', async (req, res, next) => {
  try {
    let symbols;
    try {
      symbols = JSON.parse(req.query.symbols);
    } catch {
      return res.status(400).json({ error: 'Provide symbols as a JSON array.' });
    }

    if (
      !Array.isArray(symbols) ||
      symbols.length === 0 ||
      symbols.length > allowedSymbols.size ||
      symbols.some((symbol) => typeof symbol !== 'string' || !allowedSymbols.has(symbol.replace(/USDT$/, '')) || !symbol.endsWith('USDT'))
    ) {
      return res.status(400).json({ error: 'One or more requested market symbols are invalid.' });
    }

    const uniqueSymbols = [...new Set(symbols)];
    const cacheKey = uniqueSymbols.join(',');
    const cached = tickerCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.result);
    }

    const url = new URLSearchParams({ symbols: JSON.stringify(uniqueSymbols) });
    const payload = await fetchBinance(`/ticker/24hr?${url}`);
    if (!Array.isArray(payload)) {
      throw new MarketProviderError('Market data provider returned an invalid ticker response.');
    }

    const histories = await Promise.all(uniqueSymbols.map(async (binanceSymbol) => {
      const historyQuery = new URLSearchParams({
        symbol: binanceSymbol,
        interval: '1d',
        limit: '7'
      });
      const rows = await fetchBinance(`/klines?${historyQuery}`);
      const closes = Array.isArray(rows)
        ? rows.map((row) => Number(row[4])).filter((price) => Number.isFinite(price) && price > 0)
        : [];
      if (closes.length < 7) {
        throw new MarketProviderError(`Historical prices are unavailable for ${binanceSymbol}.`);
      }
      return [binanceSymbol, closes];
    }));
    const historyBySymbol = new Map(histories);

    const tickers = payload.map((ticker) => {
      const price = Number(ticker.lastPrice);
      const history7d = historyBySymbol.get(ticker.symbol);
      if (!history7d) {
        throw new MarketProviderError(`Historical prices are unavailable for ${ticker.symbol}.`);
      }
      const symbol = ticker.symbol.replace(/USDT$/, '');
      return {
        symbol: ticker.symbol,
        price,
        change24h: Number(ticker.priceChangePercent),
        change7d: ((price / history7d[0]) - 1) * 100,
        volume24h: Number(ticker.quoteVolume),
        marketCap: price * circulatingSupplies[symbol],
        history7d
      };
    });
    if (
      tickers.length !== uniqueSymbols.length ||
      tickers.some((ticker) =>
        !uniqueSymbols.includes(ticker.symbol) ||
        !Number.isFinite(ticker.price) ||
        ticker.price <= 0 ||
        !Number.isFinite(ticker.change24h) ||
        !Number.isFinite(ticker.change7d) ||
        !Number.isFinite(ticker.volume24h) ||
        !Number.isFinite(ticker.marketCap)
      )
    ) {
      throw new MarketProviderError('Market data provider returned incomplete ticker data.');
    }

    const result = { tickers, updatedAt: new Date().toISOString() };
    tickerCache.set(cacheKey, { result, expiresAt: Date.now() + TICKER_TTL_MS });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

marketRouter.get('/predictions/:symbol', async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    if (!allowedSymbols.has(symbol)) {
      return res.status(404).json({ error: 'Forecast is not available for this asset.' });
    }

    const cached = predictionCache.get(symbol);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.result);
    }

    const query = new URLSearchParams({
      symbol: `${symbol}USDT`,
      interval: '1d',
      limit: '200'
    });
    const rows = await fetchBinance(`/klines?${query}`);
    if (!Array.isArray(rows)) {
      throw new MarketProviderError('Market data provider returned invalid historical prices.');
    }

    const result = createPrediction(symbol, rows);
    predictionCache.set(symbol, { result, expiresAt: Date.now() + PREDICTION_TTL_MS });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
