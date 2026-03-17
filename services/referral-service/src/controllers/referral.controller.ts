import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Referral from '../models/Referral';

export const getMyReferrals = async (req: AuthRequest, res: Response) => {
  try {
    const referrals = await Referral.find({ referrer: req.userId })
      .populate('referred', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
