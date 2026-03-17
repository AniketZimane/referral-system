import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import purchaseRoutes from './routes/purchase.routes';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PURCHASE_SERVICE_PORT || 5004;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/referral-auth')
  .then(() => console.log('Purchase Service: MongoDB connected'))
  .catch((err) => console.error('Purchase Service: MongoDB error', err));

app.use('/purchase', purchaseRoutes);

app.get('/health', (_, res) => res.json({ service: 'purchase-service', status: 'ok' }));

app.listen(PORT, () => console.log(`Purchase Service running on port ${PORT}`));
