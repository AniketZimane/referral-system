import { Router } from 'express';
import { simulatePurchase } from '../controllers/purchase.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/simulate', authenticateToken, simulatePurchase);

export default router;
