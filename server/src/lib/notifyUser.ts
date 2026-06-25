import {
  UserNotification,
  type UserNotificationType,
} from '../models/UserNotification.js';

export async function notifyUser(input: {
  userId: string;
  phone?: string;
  type: UserNotificationType;
  title: string;
  message: string;
  orderId?: string;
  returnId?: string;
  link?: string;
}) {
  await UserNotification.create({
    userId: input.userId,
    phone: input.phone,
    type: input.type,
    title: input.title,
    message: input.message,
    orderId: input.orderId,
    returnId: input.returnId,
    link: input.link ?? (input.orderId ? `/account/orders` : '/account/notifications'),
    read: false,
  });
}
