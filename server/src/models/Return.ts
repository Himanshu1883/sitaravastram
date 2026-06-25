import mongoose, { Schema, type Document } from 'mongoose';

export type ReturnStatus =
  | 'pending'
  | 'approved'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'received'
  | 'refund_initiated'
  | 'refunded'
  | 'rejected';

export interface IReturnRequest extends Document {
  legacyId: string;
  orderId: string;
  userId?: string;
  phone?: string;
  customer: string;
  product: string;
  items?: unknown[];
  reason: string;
  comment?: string;
  status: ReturnStatus;
  date: string;
  refundAmount?: number;
  adminNote?: string;
}

const returnSchema = new Schema<IReturnRequest>(
  {
    legacyId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true, index: true },
    userId: String,
    phone: String,
    customer: String,
    product: String,
    items: [Schema.Types.Mixed],
    reason: String,
    comment: String,
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'pickup_scheduled',
        'picked_up',
        'received',
        'refund_initiated',
        'refunded',
        'rejected',
      ],
      default: 'pending',
    },
    date: String,
    refundAmount: Number,
    adminNote: String,
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
    items: doc.items,
    reason: doc.reason,
    comment: doc.comment,
    status: doc.status,
    date: doc.date,
    refundAmount: doc.refundAmount,
    adminNote: doc.adminNote,
  };
}
