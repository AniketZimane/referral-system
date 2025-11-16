import express from 'express';
import Referral from '../models/Referral';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/my-referrals', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.userId })
      .populate('referred', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;