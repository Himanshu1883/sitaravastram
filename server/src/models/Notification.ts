import mongoose, { Schema, type Document } from 'mongoose';

export interface INotification extends Document {
  legacyId: string;
  title: string;
  message: string;
  sentAt: string;
  audience: string;
}

const notificationSchema = new Schema<INotification>(
  {
    legacyId: { type: String, required: true, unique: true },
    title: String,
    message: String,
    sentAt: String,
    audience: String,
  },
  { timestamps: true },
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export function toNotificationDto(doc: INotification) {
  return {
    id: doc.legacyId,
    title: doc.title,
    message: doc.message,
    sentAt: doc.sentAt,
    audience: doc.audience,
  };
}
