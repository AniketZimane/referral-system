import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  referralCode: string;
  referredBy?: string;
  credits: number;
  hasPurchased: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String, ref: 'User' },
  credits: { type: Number, default: 0 },
  hasPurchased: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);