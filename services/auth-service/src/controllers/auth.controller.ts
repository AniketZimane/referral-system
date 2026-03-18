import mongoose from 'mongoose';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';
import Referral from '../models/Referral';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const generateReferralCode = (name: string): string => {
  const clean = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${clean}${random}`;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, referralCode } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      referralCode: generateReferralCode(name),
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id as mongoose.Types.ObjectId;
        await new Referral({ referrer: referrer._id, referred: user._id }).save();
      }
    }

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, referralCode: user.referralCode, credits: user.credits },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, referralCode: user.referralCode, credits: user.credits },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
    res.status(500).json({ error: 'Server error' });
  }
};
