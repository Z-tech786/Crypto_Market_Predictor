# MongoDB database

The Express API connects to MongoDB using `MONGODB_URI`. Mongoose schemas in
`backend/src/models` define users, paper wallets/trades, and learning progress.

For local development, start MongoDB and configure `backend/.env`. The Docker
Compose setup in `frontend/docker-compose.yml` starts MongoDB and the API
together. MongoDB files are stored in `database/data` on this computer; that
directory is ignored by Git and should not be committed.
