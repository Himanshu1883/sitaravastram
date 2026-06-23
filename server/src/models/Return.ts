import mongoose, { Schema, type Document } from 'mongoose';

export interface IReturnRequest extends Document {
  legacyId: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  date: string;
}

const returnSchema = new Schema<IReturnRequest>(
  {
    legacyId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    customer: String,
    product: String,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'refunded'],
      default: 'pending',
    },
    date: String,
  },
  { timestamps: true },
);

export const ReturnRequest = mongoose.model<IReturnRequest>('ReturnRequest', returnSchema);

export function toReturnDto(doc: IReturnRequest) {
  return {
    id: doc.legacyId,
    orderId: doc.orderId,
    customer: doc.customer,
    product: doc.product,
    reason: doc.reason,
    status: doc.status,
    date: doc.date,
  };
}
