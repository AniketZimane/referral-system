import express from 'express';
import User from '../models/User';
import Referral from '../models/Referral';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referrals = await Referral.find({ referrer: req.userId });
    const convertedReferrals = referrals.filter(r => r.status === 'converted');

    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits
      },
      stats: {
        totalReferrals: referrals.length,
        convertedReferrals: convertedReferrals.length,
        totalCreditsEarned: user.credits,
        referralLink: `https://referral-system-amber.vercel.app/register?r=${user.referralCode}`
      }
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
