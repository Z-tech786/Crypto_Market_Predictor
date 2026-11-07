# Crypto Market Predictor frontend

## Run with Docker

From this directory, build and start the production frontend:

```sh
docker compose up --build
```

Open [http://localhost:8081](http://localhost:8081). Stop the container with `Ctrl+C`, or run `docker compose down` in another terminal.

The image builds the Vite app and serves its production files with Nginx. Client-side routes fall back to `index.html`.

## Run locally

```sh
npm ci
npm run dev
```

The development server URL is printed by Vite.
