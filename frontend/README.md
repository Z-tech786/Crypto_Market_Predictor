# Crypto Market Predictor frontend

## Run with Docker

From this directory, build and start the production frontend:

```sh
docker compose up --build
```

```sh
docker compose up --build -d
```

Open [http://localhost:8081](http://localhost:8081). View background container logs with `docker compose logs -f frontend`, and stop the container with `docker compose down`.

The image builds the Vite app and serves its production files with Nginx. Client-side routes fall back to `index.html`.

## Run locally

```sh
npm ci
npm run dev
```

The development server URL is printed by Vite.
