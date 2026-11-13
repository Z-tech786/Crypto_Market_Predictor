import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { query, activeCoin } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query string is required.' });
  }

  // 1. Try Python FastAPI AI service first
  try {
    const pyResp = await axios.post('http://127.0.0.1:8000/assistant', {
      query,
      activeCoin: activeCoin || 'Bitcoin'
    }, { timeout: 1500 });

    if (pyResp.data && pyResp.data.success) {
      return res.json({
        success: true,
        source: 'FastAPI Python LLM Service',
        reply: pyResp.data.reply
      });
    }
  } catch (err) {
    // Fall through to backend assistant engine
  }

  // 2. Intelligent Educational Crypto Assistant Engine
  const q = query.toLowerCase();
  let reply = '';

  if (q.includes('rsi') || q.includes('relative strength')) {
    reply = `**Relative Strength Index (RSI):**
    
• **What it is:** A momentum oscillator on a scale of 0 to 100 measuring the speed and velocity of price changes.
• **Overbought (RSI > 70):** Indicates strong buying euphoria; potential pullback or consolidation may follow.
• **Oversold (RSI < 30):** Indicates panic selling; often signals a rebound or bargain accumulation zone.
• **Formula:** \`RSI = 100 - (100 / (1 + RS))\`, where RS is average gain over average loss (typically 14 periods).`;
  } else if (q.includes('halving') || q.includes('bitcoin halving')) {
    reply = `**Bitcoin Halving Explained:**
    
• **The Mechanism:** Every 210,000 blocks (~4 years), the block reward issued to miners is mathematically reduced by 50%.
• **Issuance History:** Started at 50 BTC (2009) → 25 BTC (2012) → 12.5 BTC (2016) → 6.25 BTC (2020) → 3.125 BTC in 2024.
• **Economic Impact:** With supply cut in half while demand stays steady or increases, halving creates supply compression historically leading to parabolic bull phases.`;
  } else if (q.includes('impermanent loss') || q.includes('defi') || q.includes('liquidity')) {
    reply = `**Impermanent Loss in DeFi Liquidity Pools:**
    
• **Definition:** The temporary loss of dollar value you experience when depositing tokens into an Automated Market Maker (AMM) compared to simply holding them in your wallet.
• **How it Happens:** AMMs rely on constant product formulas (\`x * y = k\`). When price ratios diverge, arbitrageurs rebalance the pool, leaving you with more of the declining token and less of the rising token.
• **Mitigation:** Yield farming rewards, staking incentives, and trading transaction fee shares help offset this loss.`;
  } else if (q.includes('lstm') || q.includes('neural') || q.includes('machine learning') || q.includes('predict')) {
    reply = `**How the LSTM Predictive Engine Operates:**
    
1. **Recurrent Memory Cells:** Long Short-Term Memory (LSTM) networks resolve the vanishing gradient issue of traditional RNNs using input, forget, and output gates.
2. **Multi-Feature Input Tensor:** Combines historical OHLCV candles, technical indicators (RSI, MACD, Bollinger Bands), on-chain transaction velocity, and NLP sentiment polarity scores.
3. **95% Bayesian Confidence Bands:** Outputs future statistical price trajectories alongside upper and lower risk dispersion envelopes to model non-linear market stochasticity.`;
  } else {
    reply = `Regarding **"${query}"**:
    
In digital asset markets and algorithmic trading systems:
• **Market Fundamentals:** Protocol utility, active wallet addresses, tokenomics (inflation/burn rate), and regulatory developments.
• **Quantitative Technicals:** Volume distribution, moving average crossovers (SMA 50 / SMA 200), and order-book depth.
• **Risk Management:** Never risk more than 1-2% of simulated equity on a single setup, and always define stop-loss levels.`;
  }

  return res.json({
    success: true,
    source: 'NeuroCrypto AI Assistant Engine',
    reply
  });
});

export default router;
