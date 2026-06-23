import { Router } from 'express';
import { sendOtp, verifyOtp, validateIndianMobile } from '../services/otp.js';
import { verifyToken } from '../middleware/auth.js';
import { User, toUserDto } from '../models/User.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authOptional } from '../middleware/auth.js';

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
    const { user, token } = await verifyOtp(phone, otp);
    res.json({ token, user: toUserDto(user) });
  } catch (err) {
    next(err instanceof Error ? new ApiError(400, err.message) : err);
  }
});

router.get('/me', authOptional, async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'customer') {
      return res.json({ user: null });
    }
    const user = await User.findById(req.user.sub);
    if (!user) return res.json({ user: null });
    res.json({ user: toUserDto(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
