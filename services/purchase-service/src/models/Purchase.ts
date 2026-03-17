import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  productName: string;
  amount: number;
  isFirstPurchase: boolean;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  isFirstPurchase: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);
