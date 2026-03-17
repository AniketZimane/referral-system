import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import referralRoutes from './routes/referral.routes';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.REFERRAL_SERVICE_PORT || 5003;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/referral-auth')
  .then(() => console.log('Referral Service: MongoDB connected'))
  .catch((err) => console.error('Referral Service: MongoDB error', err));

app.use('/referral', referralRoutes);

app.get('/health', (_, res) => res.json({ service: 'referral-service', status: 'ok' }));

app.listen(PORT, () => console.log(`Referral Service running on port ${PORT}`));
