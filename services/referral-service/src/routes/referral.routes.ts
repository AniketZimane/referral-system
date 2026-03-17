import { Router } from 'express';
import { getMyReferrals } from '../controllers/referral.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/my-referrals', authenticateToken, getMyReferrals);

export default router;
