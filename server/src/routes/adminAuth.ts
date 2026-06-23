import { Router } from 'express';
import { adminLogin } from '../services/otp.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new ApiError(400, 'Email and password are required'));
    const { admin, token } = await adminLogin(email, password);
    res.json({ token, admin: { email: admin.email, name: admin.name } });
  } catch (err) {
    next(err instanceof Error ? new ApiError(401, err.message) : err);
  }
});

export default router;
