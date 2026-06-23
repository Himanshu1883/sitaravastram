import mongoose, { Schema, type Document } from 'mongoose';

export interface ICoupon extends Document {
  legacyId: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  expiry: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

const couponSchema = new Schema<ICoupon>(
  {
    legacyId: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percent', 'flat'], required: true },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    expiry: { type: String, required: true },
    usageLimit: { type: Number, default: 1000 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);

export function toCouponDto(doc: ICoupon) {
  return {
    id: doc.legacyId,
    code: doc.code,
    type: doc.type,
    value: doc.value,
    minOrder: doc.minOrder,
    expiry: doc.expiry,
    usageLimit: doc.usageLimit,
    usedCount: doc.usedCount,
    active: doc.active,
  };
}
