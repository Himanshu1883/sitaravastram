import mongoose, { Schema, type Document } from 'mongoose';

export type UserRole = 'user' | 'admin';
export type AuthProvider = 'phone' | 'google' | 'email';

export interface IUser extends Document {
  phone?: string;
  name?: string;
  email?: string;
  role: UserRole;
  authProviders: AuthProvider[];
  googleId?: string;
}

const userSchema = new Schema<IUser>(
  {
    phone: { type: String, sparse: true, unique: true },
    name: String,
    email: { type: String, sparse: true, lowercase: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    authProviders: { type: [String], default: ['phone'] },
    googleId: { type: String, sparse: true, unique: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);

export function toUserDto(doc: IUser) {
  return {
    id: doc._id.toString(),
    phone: doc.phone,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    authProviders: doc.authProviders,
  };
}
