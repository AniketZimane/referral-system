import { Router } from 'express';
import { getDashboard } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateToken, getDashboard);

export default router;
