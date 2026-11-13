import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import botRoutes from './routes/botRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cryptos', cryptoRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assistant', assistantRoutes);

// Root Health & Metadata
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'AI-Based Crypto Market Prediction and Educational Assistant System',
    authors: [
      { name: 'Farhan Ijaz', rollNumber: '23L-0568' },
      { name: 'Zain-ul-Abideen', rollNumber: '23L-0858' }
    ],
    architecture: 'React (Vite) <-> Express/Node <-> MongoDB + Python FastAPI AI Service',
    endpoints: [
      '/api/auth',
      '/api/cryptos',
      '/api/trades',
      '/api/education',
      '/api/news',
      '/api/bots',
      '/api/admin',
      '/api/assistant'
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Initialize Server & Database
const startServer = async () => {
  const isDbConnected = await connectDB();
  if (isDbConnected) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 NeuroCrypto Express API Server running on http://localhost:${PORT}`);
    console.log(`📦 MongoDB Status: ${isDbConnected ? 'Connected & Seeded' : 'Running in Adaptive Mode'}`);
    console.log(`🧠 AI Service Expected on: http://localhost:8000 (Python FastAPI)`);
    console.log(`💻 Frontend Expected on: http://localhost:5173 (React Vite)`);
    console.log(`================================================================`);
  });
};

startServer();
