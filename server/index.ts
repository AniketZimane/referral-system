import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import referralRoutes from './routes/referral';
import purchaseRoutes from './routes/purchase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/referral-system';
console.log('Connecting to MongoDB:', mongoUri.replace(/:([^@]+)@/, ':****@'));
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/purchase', purchaseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});