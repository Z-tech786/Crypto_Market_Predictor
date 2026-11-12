FROM node:22-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/src ./src
COPY database/connection.js /app/database/connection.js

EXPOSE 5000

CMD ["npm", "start"]
