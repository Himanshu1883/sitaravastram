import mongoose, { Schema, type Document } from 'mongoose';

export interface IOtpSession extends Document {
  phone: string;
  otpHash: string;
  expiresAt: Date;
}

const otpSessionSchema = new Schema<IOtpSession>(
  {
    phone: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export const OtpSession = mongoose.model<IOtpSession>('OtpSession', otpSessionSchema);
