import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrer: string;
  referred: string;
  status: 'pending' | 'converted';
  creditsAwarded: boolean;
  createdAt: Date;
  convertedAt?: Date;
}

const ReferralSchema = new Schema<IReferral>({
  referrer: { type: String, ref: 'User', required: true },
  referred: { type: String, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'converted'], default: 'pending' },
  creditsAwarded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  convertedAt: { type: Date }
});

export default mongoose.model<IReferral>('Referral', ReferralSchema);