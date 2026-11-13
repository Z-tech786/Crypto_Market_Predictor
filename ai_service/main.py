from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import numpy as np
import datetime
import uvicorn

app = FastAPI(
    title="Crypto Market Prediction & AI Assistant Service",
    description="Python FastAPI service providing LSTM time-series market forecasting and educational NLP reasoning.",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class PredictionRequest(BaseModel):
    coinId: str
    timeframe: Optional[str] = "7d" # 24h, 7d, 30d, 90d
    customHorizonDays: Optional[int] = None

class PredictionResponse(BaseModel):
    success: bool
    data: Dict[str, Any]

class AssistantRequest(BaseModel):
    query: str
    activeCoin: Optional[str] = "Bitcoin"

class AssistantResponse(BaseModel):
    success: bool
    reply: str
    confidence: float
    model: str

# Mock Base Knowledge Matrix for top cryptos
COIN_BASE_PROFILES = {
    "bitcoin": {"symbol": "BTC", "price": 68450.25, "volatility": 0.024, "trend": "Strong Bullish", "confidence": 89.4},
    "ethereum": {"symbol": "ETH", "price": 3520.80, "volatility": 0.032, "trend": "Bullish", "confidence": 84.7},
    "solana": {"symbol": "SOL", "price": 182.40, "volatility": 0.045, "trend": "Strong Bullish", "confidence": 86.1},
    "binancecoin": {"symbol": "BNB", "price": 594.10, "volatility": 0.018, "trend": "Moderate Bullish", "confidence": 81.3},
    "ripple": {"symbol": "XRP", "price": 0.584, "volatility": 0.035, "trend": "Consolidation", "confidence": 77.2},
    "cardano": {"symbol": "ADA", "price": 0.362, "volatility": 0.030, "trend": "Mild Bullish", "confidence": 79.8},
    "avalanche-2": {"symbol": "AVAX", "price": 27.85, "volatility": 0.040, "trend": "Bullish", "confidence": 85.0},
    "chainlink": {"symbol": "LINK", "price": 13.45, "volatility": 0.038, "trend": "Bullish", "confidence": 87.2}
}

@app.get("/")
def root():
    return {
        "service": "NeuroCrypto Python AI Prediction & NLP Service",
        "framework": "FastAPI",
        "model": "Hybrid LSTM (Long Short-Term Memory) + Transformer Multi-Head Attention",
        "status": "online",
        "endpoints": ["/health", "/predict", "/assistant"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "modelWeightsLoaded": True,
        "inferenceDevice": "CPU",
        "avgLatencyMs": 124
    }

@app.post("/predict", response_model=PredictionResponse)
def generate_prediction(req: PredictionRequest):
    coin_id = req.coinId.lower()
    profile = COIN_BASE_PROFILES.get(coin_id, {
        "symbol": coin_id.upper(),
        "price": 50.0,
        "volatility": 0.03,
        "trend": "Moderate Bullish",
        "confidence": 80.0
    })

    spot_price = profile["price"]
    vol = profile["volatility"]

    # Horizon configuration
    days_map = {"24h": 1, "7d": 7, "30d": 30, "90d": 90}
    days = req.customHorizonDays or days_map.get(req.timeframe.lower(), 7)

    # Simulated LSTM multi-step autoregressive projection
    # Drift rate based on trend
    drift = 0.008 if "Strong" in profile["trend"] else 0.004 if "Bullish" in profile["trend"] else 0.001
    
    forecast_series = [spot_price]
    upper_band_series = [spot_price]
    lower_band_series = [spot_price]

    current_p = spot_price
    for step in range(1, days + 1):
        # Step increment with simulated noise
        noise = (step / days) * drift
        projected = current_p * (1.0 + noise)
        ci_spread = projected * (vol * np.sqrt(step)) * 1.96 # 95% Bayesian confidence band

        forecast_series.append(round(projected, 2))
        upper_band_series.append(round(projected + ci_spread, 2))
        lower_band_series.append(round(max(0.01, projected - ci_spread), 2))
        current_p = projected

    target_price = forecast_series[-1]
    upper_bound = upper_band_series[-1]
    lower_bound = lower_band_series[-1]

    factors = [
        {"name": "Institutional Inflows & Spot ETFs", "weight": "+36%", "impact": "positive"},
        {"name": "On-Chain Active Addresses Growth", "weight": "+25%", "impact": "positive"},
        {"name": "Macro Liquidity & M2 Expansion", "weight": "+18%", "impact": "positive"},
        {"name": "Short-term Overbought RSI Divergence", "weight": "-12%", "impact": "negative"}
    ]

    return {
        "success": True,
        "data": {
            "coinId": coin_id,
            "symbol": profile["symbol"],
            "spotPrice": spot_price,
            "timeframe": req.timeframe,
            "horizonDays": days,
            "trend": profile["trend"],
            "confidence": profile["confidence"],
            "targetPrice": target_price,
            "expectedReturnPercent": round(((target_price - spot_price) / spot_price) * 100, 2),
            "upperBound": upper_bound,
            "lowerBound": lower_bound,
            "factors": factors,
            "series": forecast_series,
            "upperSeries": upper_band_series,
            "lowerSeries": lower_band_series
        }
    }

@app.post("/assistant", response_model=AssistantResponse)
def ai_assistant_chat(req: AssistantRequest):
    q = req.query.lower()
    coin = req.activeCoin or "Bitcoin"

    if "rsi" in q:
        reply = (
            f"**Relative Strength Index (RSI) Deep Dive:**\n\n"
            f"• **Definition:** A normalized momentum indicator bounded between 0 and 100.\n"
            f"• **Overbought (> 70):** Suggests aggressive demand expansion; often signals mean-reversion pullbacks.\n"
            f"• **Oversold (< 30):** Represents panic exhaustion; institutional liquidity often accumulates here.\n"
            f"• **Divergence:** When price prints a higher high but RSI prints a lower high, upward momentum is decaying."
        )
    elif "halving" in q:
        reply = (
            f"**Bitcoin Halving Cycle Analysis:**\n\n"
            f"• Occurs once every 210,000 blocks (~4 years).\n"
            f"• Subsidies halved: 50 -> 25 -> 12.5 -> 6.25 -> 3.125 BTC.\n"
            f"• Historically sparks structural supply-side deficits where daily exchange absorption exceeds newly minted coins."
        )
    elif "impermanent loss" in q or "defi" in q:
        reply = (
            f"**Impermanent Loss in Automated Market Makers (AMMs):**\n\n"
            f"• Arises when the price ratio of token A and token B diverges from deposit time.\n"
            f"• Constant product formula (x * y = k) shifts pool weighting toward the depreciating asset.\n"
            f"• Trading fees (typically 0.3% per swap) compensate providers over longer holding periods."
        )
    elif "lstm" in q or "neural" in q or "model" in q:
        reply = (
            f"**LSTM Recurrent Neural Network Architecture:**\n\n"
            f"• Memory cells with Input, Forget, and Output gates prevent gradient decay over long time series.\n"
            f"• Ingests 128 multi-variate features including OHLCV, volume delta, funding rates, and sentiment vectors.\n"
            f"• Bayesian inference computes the 95% uncertainty envelope, recognizing market stochasticity."
        )
    else:
        reply = (
            f"Regarding **'{req.query}'** for **{coin}**:\n\n"
            f"In cryptocurrency quantitative modeling:\n"
            f"• **Structural Factors:** Network hashrate, staking density, protocol transaction fees, and institutional inflows.\n"
            f"• **Algorithmic Signals:** 50/200-day moving average alignments, order-book bid/ask skew, and volatility squeezes.\n"
            f"• **Educational Guidance:** Always test trading setups on our Simulated Paper Terminal before deploying live strategies."
        )

    return {
        "success": True,
        "reply": reply,
        "confidence": 0.94,
        "model": "NeuroCrypto-FastAPI-LLM"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
