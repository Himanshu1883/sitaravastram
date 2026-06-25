import mongoose, { Schema, type Document } from 'mongoose';
import {
  normalizeStatusHistory,
  serializeStatusHistory,
  type OrderStatus,
  type StatusHistoryEntry,
} from '../lib/orderTimeline.js';

const addressSchema = new Schema(
  {
    id: String,
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    isDefault: Boolean,
  },
  { _id: false },
);

const cartItemSchema = new Schema(
  {
    product: Schema.Types.Mixed,
    size: String,
    color: String,
    quantity: Number,
  },
  { _id: false },
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned'],
      required: true,
    },
    at: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: String, enum: ['admin', 'system'], default: 'system' },
  },
  { _id: false },
);

export interface IOrder extends Document {
  orderId: string;
  date: string;
  status: OrderStatus;
  statusHistory?: StatusHistoryEntry[];
  items: unknown[];
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
  email?: string;
  address: unknown;
  trackingNumber?: string;
  phone?: string;
  customer?: string;
  userId?: string;
  createdAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    statusHistory: [statusHistorySchema],
    items: [cartItemSchema],
    subtotal: Number,
    discount: Number,
    shipping: Number,
    codFee: Number,
    total: Number,
    paymentMethod: { type: String, enum: ['razorpay', 'cod'] },
    couponCode: String,
    email: String,
    address: addressSchema,
    trackingNumber: String,
    phone: String,
    customer: String,
    userId: String,
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);

export function toOrderDto(doc: IOrder) {
  const history = normalizeStatusHistory(doc);
  return {
    id: doc.orderId,
    date: doc.date,
    status: doc.status,
    statusHistory: serializeStatusHistory(history),
    items: doc.items,
    subtotal: doc.subtotal,
    discount: doc.discount,
    shipping: doc.shipping,
    codFee: doc.codFee,
    total: doc.total,
    paymentMethod: doc.paymentMethod,
    couponCode: doc.couponCode,
    email: doc.email,
    address: doc.address,
    trackingNumber: doc.trackingNumber,
    phone: doc.phone,
    customer: doc.customer,
  };
}
