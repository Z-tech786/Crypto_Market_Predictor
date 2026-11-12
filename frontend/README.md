# Crypto Market Predictor frontend

## Run the full application with Docker

From this directory, create a `.env` file containing a strong random `JWT_SECRET`,
then build and start the frontend, Express API, and MongoDB:

```sh
Set-Content .env "JWT_SECRET=replace-with-a-long-random-secret"
docker compose up --build
```

To run it in the background instead:

```sh
docker compose up --build -d
```

Open [http://localhost:8081](http://localhost:8081). View logs with `docker compose logs -f`, and stop the containers with `docker compose down`. MongoDB files are stored locally in `database/data` and are not committed to Git.

The frontend is served by Nginx and proxies `/api` requests to Express. The API stores accounts, paper trading wallets, watchlists, bot settings, and learning progress in MongoDB.

## Run locally

Start MongoDB, then in `backend`, copy `.env.example` to `.env`, set a unique `JWT_SECRET`, and run:

```sh
npm install
npm run dev
```

In another terminal:

```sh
npm ci
npm run dev
```

Vite proxies `/api` requests to `http://localhost:5000`. The development server URL is printed by Vite.
