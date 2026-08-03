import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'USER' | 'ADMIN' };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[env.cookieName];
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = cookieToken ?? headerToken;

  if (!token) return next(ApiError.unauthorized());

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized('Session invalide ou expirée'));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[env.cookieName];
  if (!cookieToken) return next();
  try {
    const payload = verifyToken(cookieToken);
    req.user = { id: payload.userId, role: payload.role };
  } catch {
    // token invalide : on continue en mode anonyme
  }
  next();
}
