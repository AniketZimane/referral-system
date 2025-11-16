import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Referral from '../models/Referral';
import Purchase from '../models/Purchase';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/simulate', authenticateToken, async (req: AuthRequest, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productName, amount } = req.body;

    const user = await User.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'User not found' });
    }

    const isFirstPurchase = !user.hasPurchased;

    const purchase = new Purchase({
      userId: req.userId,
      productName,
      amount,
      isFirstPurchase
    });

    if (isFirstPurchase) {
      user.hasPurchased = true;
      user.credits += 2; // User gets 2 credits for their first purchase

      if (user.referredBy) {
        const referral = await Referral.findOne({
          referrer: user.referredBy,
          referred: req.userId,
          creditsAwarded: false
        }).session(session);

        if (referral) {
          const referrer = await User.findById(user.referredBy).session(session);
          if (referrer) {
            referrer.credits += 2; // Referrer gets 2 credits
            await referrer.save({ session });

            referral.status = 'converted';
            referral.creditsAwarded = true;
            referral.convertedAt = new Date();
            await referral.save({ session });
          }
        }
      }
    }

    await user.save({ session });
    await purchase.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      purchase: {
        id: purchase._id,
        productName: purchase.productName,
        amount: purchase.amount,
        isFirstPurchase: purchase.isFirstPurchase
      },
      creditsEarned: isFirstPurchase ? 2 : 0,
      totalCredits: user.credits
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Server error' });
  } finally {
    session.endSession();
  }
});

export default router;