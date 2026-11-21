FROM node:22-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./
COPY database/connection.js /app/database/connection.js

EXPOSE 5000

CMD ["node", "server.js"]
