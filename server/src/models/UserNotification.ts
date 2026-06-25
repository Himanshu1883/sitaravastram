import mongoose, { Schema, type Document } from 'mongoose';

export type UserNotificationType =
  | 'order_placed'
  | 'order_shipped'
  | 'order_delivered'
  | 'cancel_instant'
  | 'cancel_requested'
  | 'cancel_approved'
  | 'cancel_rejected'
  | 'return_submitted'
  | 'return_approved'
  | 'return_rejected'
  | 'return_refunded';

export interface IUserNotification extends Document {
  userId: string;
  phone?: string;
  type: UserNotificationType;
  title: string;
  message: string;
  orderId?: string;
  returnId?: string;
  link?: string;
  read: boolean;
  createdAt?: Date;
}

const userNotificationSchema = new Schema<IUserNotification>(
  {
    userId: { type: String, required: true, index: true },
    phone: String,
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    orderId: String,
    returnId: String,
    link: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userNotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const UserNotification = mongoose.model<IUserNotification>(
  'UserNotification',
  userNotificationSchema,
);

export function toUserNotificationDto(doc: IUserNotification) {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    type: doc.type,
    title: doc.title,
    message: doc.message,
    orderId: doc.orderId,
    returnId: doc.returnId,
    link: doc.link,
    read: doc.read,
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}
