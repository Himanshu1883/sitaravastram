import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { ApiError } from '../middleware/errorHandler.js';

export type JwtRole = 'user' | 'admin';

export interface JwtPayload {
  sub: string;
  role: JwtRole;
  phone?: string;
  email?: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.jwtSecret) as JwtPayload & { role?: string };
  if ((payload.role as string) === 'customer') {
    payload.role = 'user';
  }
  return payload as JwtPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {
      // ignore invalid token
    }
  }
  next();
}

export function requireUser(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new ApiError(401, 'Unauthorized'));
  try {
    const user = verifyToken(header.slice(7));
    if (user.role !== 'user') return next(new ApiError(401, 'Unauthorized'));
    req.user = user;
    next();
  } catch {
    next(new ApiError(401, 'Invalid token'));
  }
}

/** @deprecated use requireUser */
export const requireCustomer = requireUser;

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new ApiError(401, 'Admin authentication required'));
  try {
    const user = verifyToken(header.slice(7));
    if (user.role !== 'admin') return next(new ApiError(403, 'Admin access required'));
    req.user = user;
    next();
  } catch {
    next(new ApiError(401, 'Invalid admin token'));
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
