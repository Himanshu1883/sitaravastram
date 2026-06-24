import { User, toUserDto, type IUser } from '../models/User.js';
import { Admin } from '../models/Admin.js';
import { OtpSession } from '../models/OtpSession.js';
import { hashPassword, comparePassword, signToken } from '../middleware/auth.js';
import { env } from '../config/env.js';

export function normalizeIndianMobile(input: string): string {
  return input.replace(/\D/g, '').slice(-10);
}

export function validateIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(phone));
}

export async function sendOtp(phone: string): Promise<void> {
  const normalized = normalizeIndianMobile(phone);
  const otpHash = await hashPassword(env.mockOtp);
  await OtpSession.deleteMany({ phone: normalized });
  await OtpSession.create({
    phone: normalized,
    otpHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
}

export async function verifyOtp(phone: string, otp: string) {
  const normalized = normalizeIndianMobile(phone);
  const session = await OtpSession.findOne({ phone: normalized }).sort({ createdAt: -1 });
  if (!session) throw new Error('OTP session not found. Please request a new OTP.');
  if (session.expiresAt < new Date()) throw new Error('OTP has expired. Please request a new OTP.');
  const valid = await comparePassword(otp.replace(/\D/g, ''), session.otpHash);
  if (!valid) throw new Error('Invalid OTP');

  await OtpSession.deleteMany({ phone: normalized });

  const existing = await User.findOne({ phone: normalized });
  const isNew = !existing;

  const user = await User.findOneAndUpdate(
    { phone: normalized },
    {
      $setOnInsert: {
        phone: normalized,
        role: 'user',
        authProviders: ['phone'],
      },
    },
    { upsert: true, new: true },
  );

  const token = signToken({
    sub: user!._id.toString(),
    role: user!.role,
    phone: normalized,
  });

  return { user: user!, token, isNew };
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; email?: string },
): Promise<IUser> {
  const updates: Partial<IUser> = {};
  if (data.name?.trim()) updates.name = data.name.trim();
  if (data.email?.trim()) updates.email = data.email.trim().toLowerCase();

  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });
  if (!user) throw new Error('User not found');
  return user;
}

export async function resolveAuthUser(payload: { sub: string; role: 'user' | 'admin' }) {
  if (payload.role === 'admin') {
    const admin = await Admin.findById(payload.sub);
    if (!admin) return null;
    return {
      id: admin._id.toString(),
      role: 'admin' as const,
      email: admin.email,
      name: admin.name,
      authProviders: ['email' as const],
    };
  }

  const user = await User.findById(payload.sub);
  if (!user) return null;
  return toUserDto(user);
}

export async function adminLogin(email: string, password: string) {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) throw new Error('Invalid credentials');
  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) throw new Error('Invalid credentials');
  const token = signToken({ sub: admin._id.toString(), role: 'admin', email: admin.email });
  return {
    admin,
    token,
    user: {
      id: admin._id.toString(),
      role: 'admin' as const,
      email: admin.email,
      name: admin.name,
      authProviders: ['email' as const],
    },
  };
}
