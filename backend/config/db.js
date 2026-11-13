import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crypto_prediction_db';
  
  try {
    console.log(`[MongoDB] Connecting to ${mongoURI.includes('@') ? 'MongoDB Atlas' : mongoURI}...`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000, // Timeout after 3s if mongod is not running
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (err) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB server: ${err.message}`);
    console.warn(`[MongoDB Note] Backend will operate with graceful mock/in-memory data layer if MongoDB daemon is offline.`);
    return false;
  }
};
