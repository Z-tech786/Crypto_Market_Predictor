# Crypto Market Predictor — Frontend

React + Vite frontend for Crypto Market Predictor.

## Structure

- `frontend/src/pages/` — app pages, including the dashboard and prediction screens.
- `frontend/src/components/` — navigation and reusable UI components.
- `frontend/src/hooks/` — market data hooks.
- `shared/` — browser-safe market price and bot data used by the UI.

## Run

Requires Node.js 20.19+.

```bash
npm ci
npm run dev
```

Vite starts the frontend at `http://localhost:5173` and proxies `/api` requests to `http://localhost:3000`. Start the matching Express API separately for predictions and other API-backed features.

Create a production frontend build with:

```bash
npm run build
```
