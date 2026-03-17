import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/referral-auth')
  .then(() => console.log('Auth Service: MongoDB connected'))
  .catch((err) => console.error('Auth Service: MongoDB error', err));

app.use('/auth', authRoutes);

app.get('/health', (_, res) => res.json({ service: 'auth-service', status: 'ok' }));

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
