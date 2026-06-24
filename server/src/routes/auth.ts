import { Router } from 'express';
import {
  sendOtp,
  verifyOtp,
  validateIndianMobile,
  updateUserProfile,
  resolveAuthUser,
} from '../services/auth.js';
import { authOptional, requireUser } from '../middleware/auth.js';
import { toUserDto } from '../models/User.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/otp/send', async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone || !validateIndianMobile(phone)) {
      return next(new ApiError(400, 'Kindly enter a valid mobile number.'));
    }
    await sendOtp(phone);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.post('/otp/verify', async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return next(new ApiError(400, 'Phone and OTP are required'));
    const { user, token, isNew } = await verifyOtp(phone, otp);
    res.json({ token, user: toUserDto(user), isNew });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.patch('/profile', requireUser, async (req, res, next) => {
  try {
    const { name, email } = req.body as { name?: string; email?: string };
    if (!name?.trim()) return next(new ApiError(400, 'Name is required'));
    const user = await updateUserProfile(req.user!.sub, { name, email });
    res.json({ user: toUserDto(user) });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.get('/me', authOptional, async (req, res, next) => {
  try {
    if (!req.user) return res.json({ user: null });
    const user = await resolveAuthUser(req.user);
    if (!user) return res.json({ user: null });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// Future: POST /google — verify Google ID token, upsert User, return session (authProviders includes 'google')

export default router;
