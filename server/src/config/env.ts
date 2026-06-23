import dotenv from 'dotenv';

dotenv.config();

export const env = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sitaravastram',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mockOtp: process.env.MOCK_OTP || '123456',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@sitaravastram.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'sitara2026',
  nodeEnv: process.env.NODE_ENV || 'development',
};
