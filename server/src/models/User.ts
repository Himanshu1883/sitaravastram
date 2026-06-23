import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  name?: string;
  email?: string;
}

const userSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true },
    name: String,
    email: String,
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);

export function toUserDto(doc: IUser) {
  return {
    phone: doc.phone,
    name: doc.name,
    email: doc.email,
  };
}
