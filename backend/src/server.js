import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../database/connection.js';
import { apiRouter } from './routes/api.js';

const port = Number(process.env.PORT || 5000);
const app = express();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a secret of at least 32 characters.');
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
    : 'http://localhost:5173'
}));
app.use(express.json({ limit: '100kb' }));
app.use('/api', apiRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'The submitted data is invalid.' });
  }
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

await connectToDatabase(mongoose, process.env.MONGODB_URI);
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
