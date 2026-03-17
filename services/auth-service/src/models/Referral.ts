import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrer: mongoose.Types.ObjectId;
  referred: mongoose.Types.ObjectId;
  status: 'pending' | 'converted';
  creditsAwarded: boolean;
  convertedAt?: Date;
}

const ReferralSchema = new Schema<IReferral>({
  referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referred: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'converted'], default: 'pending' },
  creditsAwarded: { type: Boolean, default: false },
  convertedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IReferral>('Referral', ReferralSchema);
