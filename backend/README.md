# Express API

The API uses Express, Mongoose, and MongoDB. Configure `MONGODB_URI` and a
`JWT_SECRET` of at least 32 characters in `backend/.env` (see
`.env.example`), then run `npm install` and `npm run dev`.

## API routes

- `POST /api/auth/register` and `POST /api/auth/login` return a bearer token.
- `GET /api/auth/me` and `PATCH /api/auth/profile` read/update account settings.
- `GET /api/market/tickers?symbols=[...]` returns live prices, 24-hour changes,
  seven-day history, and estimated tracked-asset market caps based on configured
  circulating supplies.
- `GET /api/market/predictions/:symbol` returns historical prices, technical
  indicators, and a volatility-aware linear-regression forecast.
- `GET /api/paper-trading/wallet`, `POST /api/paper-trading/orders`, and
  `POST /api/paper-trading/reset` manage paper trading.
- `PATCH /api/paper-trading/bots/:botId` saves a simulated bot's active state.
- `GET`/`PUT /api/watchlist` and `GET`/`PUT /api/progress` persist user data.
- `GET /api/health` is the unauthenticated health check.

New registrations can select the student or trader role. Administrative access
cannot be granted through public signup. Paper trades update the user's wallet
atomically in MongoDB; the UI continues to label these trades as simulations.
The forecast endpoint uses historical regression, not a trained neural network;
its output is for education and is not financial advice.
