# MetaTrader 5 (MQL5) Expert Advisors — NeuroCrypto Bots

This directory contains production-ready, custom **MQL5** Expert Advisors (EAs) corresponding directly to the autonomous trading bots integrated in the **AI-Based Crypto Market Prediction & Educational Assistant System**.

---

## 🤖 Bot Implementations

| EA File | Strategy Name | Target Pair | Recommended Timeframe | Core Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **`RSIMeanReversionBot.mq5`** | RSI Mean-Reversion Bot | `BTC/USDT` | H1 – H4 | Dynamic 14-period RSI dip-buyer (< 32 oversold) and rally-seller (> 68 overbought), with optional 200 EMA trend filter and trailing stops. |
| **`AILSTMMomentumBot.mq5`** | AI-LSTM Momentum Breakout | `SOL/USDT` | H4 – D1 | Connects to Python FastAPI AI service via `WebRequest` (or embedded neural model), triggering aggressive breakouts when predicted 24h gain >= +2.5% and AI Confidence >= 85%, confirmed by EMA golden crosses and ATR stops. |
| **`DCAAccumulatorBot.mq5`** | Dollar Cost Averaging (DCA) | `ETH/USDT` | Periodic / Step Dip | Step-down dip accumulator and timed periodic buyer with configurable multiplier, maximum order bounds, and basket take-profit target calculation. |
| **`GridVolatilityBot.mq5`** | Grid Trading Range Bot | `AVAX/USDT` / `BTC/USDT` | M15 – H1 (Sideways) | Geometric/arithmetic buy and sell grid limit orders placed across an identified support-resistance corridor to continuously capture oscillations in sideways consolidation. |

---

## 🛠️ Installation & Setup in MetaTrader 5

1. **Copy Files to MT5 Directory:**
   - In MetaTrader 5, click **File** -> **Open Data Folder**.
   - Navigate to `MQL5\Experts\`.
   - Create a folder named `NeuroCrypto` and copy all `.mq5` files from this directory into it.

2. **Compile the Expert Advisors:**
   - Open **MetaEditor** (press `F4` in MT5).
   - In the Navigator, open `Experts\NeuroCrypto\<BotName>.mq5`.
   - Click **Compile** (press `F7`). Ensure `0 errors, 0 warnings`.

3. **Enable Algo Trading & WebRequest:**
   - In MT5, go to **Tools** -> **Options** -> **Expert Advisors**.
   - Check **Allow Algo Trading**.
   - For `AILSTMMomentumBot.mq5`, check **Allow WebRequest for listed URL** and add:
     ```
     http://127.0.0.1:8000
     http://localhost:8000
     ```

4. **Attach to Chart:**
   - Drag any EA from the Navigator window onto your desired cryptocurrency chart (`BTCUSDT`, `ETHUSDT`, `SOLUSDT`, etc.).
   - Configure input parameters to match your broker's lot sizes and leverage settings.

---

## ⚙️ Key Input Parameters

### 1. `RSIMeanReversionBot.mq5`
- `InpLotSize`: Trade lot size (default: `0.05`).
- `InpRSI_Oversold`: Oversold buy threshold (default: `32.0`).
- `InpRSI_Overbought`: Overbought sell threshold (default: `68.0`).
- `InpUseEMASlowFilter`: Filter trades using 200 EMA trend direction.
- `InpTrailingStopEnable`: Dynamic trailing stop activation.

### 2. `AILSTMMomentumBot.mq5`
- `InpMinPredictedGainPct`: Required LSTM 24h price projection gain (default: `2.5%`).
- `InpMinAIConfidence`: Minimum neural model Bayesian confidence score (default: `85.0%`).
- `InpUseFastAPIService`: Enable real-time REST polling of the project's Python FastAPI AI service (`http://127.0.0.1:8000/predict`).

### 3. `DCAAccumulatorBot.mq5`
- `InpBaseLotSize`: Starting lot size (default: `0.05`).
- `InpLotMultiplier`: Multiplier for subsequent averaging orders (default: `1.25`).
- `InpMaxDCAOrders`: Hard cap on open accumulation orders (default: `8`).
- `InpBasketTakeProfitUSD`: Closed basket target profit in dollars (default: `$75.00`).
- `InpStepDropPercent`: Percentage price decline required to trigger next DCA tier (default: `2.5%`).

### 4. `GridVolatilityBot.mq5`
- `InpGridUpperPrice`: Resistance boundary for the upper grid ceiling.
- `InpGridLowerPrice`: Support boundary for the lower grid floor.
- `InpGridLevels`: Number of horizontal order intervals (default: `10`).
- `InpRangeBreakoutStopPts`: Emergency guard stopping new grid entries if market breaks out of channel.

---

## 📈 Backtesting in Strategy Tester
To evaluate any of these bots:
1. Press `Ctrl + R` in MT5 to open the **Strategy Tester**.
2. Select the Expert Advisor, Symbol (e.g. `BTCUSDT`), and Period (e.g. `H1`).
3. Set Modeling to **Every tick based on real ticks**.
4. Click **Start** to run visual backtesting and analyze the equity curves, Sharpe ratio, and drawdown metrics.
