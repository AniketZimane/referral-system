import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Referral from '../models/Referral';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const referrals = await Referral.find({ referrer: req.userId });
    const convertedReferrals = referrals.filter(r => r.status === 'converted');

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits,
      },
      stats: {
        totalReferrals: referrals.length,
        convertedReferrals: convertedReferrals.length,
        totalCreditsEarned: user.credits,
        referralLink: `${process.env.FRONTEND_URL}/register?r=${user.referralCode}`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
