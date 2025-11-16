import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  userId: string;
  productName: string;
  amount: number;
  isFirstPurchase: boolean;
  createdAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: String, ref: 'User', required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  isFirstPurchase: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);