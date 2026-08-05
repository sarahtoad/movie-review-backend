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

// Helper to extract token from either cookies or Authorization header
function extractToken(req: Request): string | undefined {
  const cookieToken = req.cookies?.[env.cookieName];

  let headerToken: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    headerToken = authHeader.slice(7).trim();
  }

  return cookieToken ?? headerToken;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) return next(ApiError.unauthorized('Non authentifié'));

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized('Session invalide ou expirée'));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = { id: payload.userId, role: payload.role };
    } catch {
      // Token invalide : on continue tranquillement en mode anonyme
    }
  }

  next();
}