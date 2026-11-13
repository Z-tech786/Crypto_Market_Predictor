# AI-Based Crypto Market Prediction and Educational Assistant System

**Course:** Web Programming  
**Group Members:**  
- Farhan Ijaz (23L-0568)  
- Zain-ul-Abideen (23L-0858)  

---

## 📌 Architecture Overview

This project is a full-stack MERN application augmented with a dedicated Python FastAPI Machine Learning microservice:

```
[ React.js (Vite) Frontend ]  (Port 5173)
            │
            ▼ REST & JSON
[ Express.js + Node.js API ]  (Port 5000)
       │               │
       ▼               ▼
[ MongoDB Database ]   [ Python FastAPI AI Service (PyTorch/LSTM) ]
(Port 27017)           (Port 8000)
```

---

## 🌟 Main Functionalities Implemented

1. **User Authentication & Role-Based Access:**
   - Registration, login, JWT token auth, bcrypt password hashing.
   - Roles: `student`, `trader`, and `admin` with dynamic role-switching.
   - 1-click evaluator login buttons for instant testing.

2. **Crypto Market Dashboard:**
   - Live ticker with price tick micro-fluctuations.
   - Market cap, 24h volume, BTC dominance, and Fear & Greed index.
   - Category filtering (Layer 1, DeFi, AI, Oracles) and search.
   - Persistent watchlist.

3. **AI Market Prediction Engine:**
   - LSTM + Multi-Head Attention neural forecasts.
   - 95% Bayesian Confidence Interval (upper/lower uncertainty envelopes).
   - Timeframes: 24 Hours, 7 Days, 30 Days, 90 Days.
   - Overlays: RSI (14), MACD, Bollinger Bands, SMA (20, 50, 200).
   - Feature weights (ETF inflows, active addresses, liquidity).

4. **AI Crypto Assistant (Chatbot):**
   - Interactive conversational assistant with preset prompts.
   - Explains candlestick patterns, indicators, halving, impermanent loss, and LSTM concepts.

5. **Simulated Paper Trading & Autonomous Bots:**
   - Virtual wallet with $10,000 USDT capital (resettable).
   - Market and Limit orders with slippage & 0.1% fee simulation.
   - 4 autonomous trading bots: RSI Mean Reversion, LSTM Momentum, DCA, and Grid.

6. **Crypto Education Academy:**
   - Beginner, Intermediate, and Advanced modules.
   - Interactive quizzes with instant scoring, feedback, and celebration confetti.

7. **News & Market Sentiment:**
   - Fear & Greed dial with historical comparisons.
   - Social sentiment polarity (Bullish, Neutral, Bearish).
   - AI-curated news feed with NLP summary tags.

8. **Portfolio Management:**
   - Asset allocation doughnut chart (Chart.js).
   - Holdings valuation, profit/loss calculations, custom holding import.

9. **Admin Panel:**
   - User governance (cycle roles, suspend/activate accounts).
   - Curriculum & quiz management.
   - System diagnostics & AI telemetry monitoring.

---

## 🚀 How to Run the Complete Stack

### Option A: 1-Click Launch (Windows)
Double-click `run_all.bat` or run:
```powershell
.\run_all.bat
```

### Option B: Run Services Individually

1. **Python AI Service (Port 8000):**
   ```bash
   cd ai_service
   python main.py
   ```
   *Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)*

2. **Express & MongoDB Backend (Port 5000):**
   ```bash
   cd backend
   npm start
   ```
   *API Root: [http://localhost:5000](http://localhost:5000)*

3. **React Vite Frontend (Port 5173):**
   ```bash
   cd frontend
   npm run dev
   ```
   *Web App: [http://localhost:5173](http://localhost:5173)*
