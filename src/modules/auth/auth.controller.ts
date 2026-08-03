import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';
import { registerUser, loginUser } from './auth.service';
import { prisma } from '../../config/prismaClient';
import { ApiError } from '../../utils/apiError';

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function toPublicUser<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, token } = await registerUser(req.body);
    setAuthCookie(res, token);
    res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, token } = await loginUser(req.body);
    setAuthCookie(res, token);
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(env.cookieName);
  res.status(204).send();
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw ApiError.unauthorized();
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}
