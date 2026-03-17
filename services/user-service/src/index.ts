import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 5002;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/referral-auth')
  .then(() => console.log('User Service: MongoDB connected'))
  .catch((err) => console.error('User Service: MongoDB error', err));

app.use('/user', userRoutes);

app.get('/health', (_, res) => res.json({ service: 'user-service', status: 'ok' }));

app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
