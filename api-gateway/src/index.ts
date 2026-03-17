import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const AUTH_SERVICE     = `http://localhost:${process.env.AUTH_SERVICE_PORT     || 5001}`;
const USER_SERVICE     = `http://localhost:${process.env.USER_SERVICE_PORT     || 5002}`;
const REFERRAL_SERVICE = `http://localhost:${process.env.REFERRAL_SERVICE_PORT || 5003}`;
const PURCHASE_SERVICE = `http://localhost:${process.env.PURCHASE_SERVICE_PORT || 5004}`;

// Route: /api/auth/* → auth-service
app.use('/api/auth', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: { '^/api/auth': '/auth' } }));

// Route: /api/user/* → user-service
app.use('/api/user', createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true, pathRewrite: { '^/api/user': '/user' } }));

// Route: /api/referral/* → referral-service
app.use('/api/referral', createProxyMiddleware({ target: REFERRAL_SERVICE, changeOrigin: true, pathRewrite: { '^/api/referral': '/referral' } }));

// Route: /api/purchase/* → purchase-service
app.use('/api/purchase', createProxyMiddleware({ target: PURCHASE_SERVICE, changeOrigin: true, pathRewrite: { '^/api/purchase': '/purchase' } }));

// Health check for all services
app.get('/health', async (_, res) => {
  res.json({
    gateway: 'ok',
    services: {
      auth:     `${AUTH_SERVICE}/health`,
      user:     `${USER_SERVICE}/health`,
      referral: `${REFERRAL_SERVICE}/health`,
      purchase: `${PURCHASE_SERVICE}/health`,
    },
  });
});

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
