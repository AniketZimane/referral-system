import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Referral from '../models/Referral';
import Purchase from '../models/Purchase';

export const simulatePurchase = async (req: AuthRequest, res: Response) => {
  try {
    const { productName, amount } = req.body;

    if (!productName || !amount) {
      return res.status(400).json({ error: 'productName and amount are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isFirstPurchase = !user.hasPurchased;

    if (isFirstPurchase) {
      user.hasPurchased = true;
      user.credits += 2;

      if (user.referredBy) {
        const referral = await Referral.findOne({
          referrer: user.referredBy,
          referred: req.userId,
          creditsAwarded: false,
        });

        if (referral) {
          const referrer = await User.findById(user.referredBy);
          if (referrer) {
            referrer.credits += 2;
            await referrer.save();

            referral.status = 'converted';
            referral.creditsAwarded = true;
            referral.convertedAt = new Date();
            await referral.save();
          }
        }
      }
    }

    await user.save();
    const purchase = await Purchase.create({ userId: req.userId, productName, amount, isFirstPurchase });

    res.json({
      success: true,
      purchase: { id: purchase._id, productName, amount, isFirstPurchase },
      creditsEarned: isFirstPurchase ? 2 : 0,
      totalCredits: user.credits,
    });
  } catch (error: any) {
    console.error('Purchase error:', error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
