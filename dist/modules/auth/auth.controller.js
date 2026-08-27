const { env } = require('../../config/env');
const { registerUser, loginUser } = require('./auth.service');
const { prisma } = require('../../config/prismaClient');
const { ApiError } = require('../../utils/apiError');

function setAuthCookie(res, token) {
  const isProduction =
    env.nodeEnv === 'production' ||
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true';

  res.cookie(env.cookieName || 'cinehub_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

async function register(req, res, next) {
  try {
    const { user, token } = await registerUser(req.body);
    setAuthCookie(res, token);
    res.status(201).json({ user: toPublicUser(user), token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await loginUser(req.body);
    setAuthCookie(res, token);
    res.json({ user: toPublicUser(user), token });
  } catch (err) {
    next(err);
  }
}

async function logout(_req, res) {
  const isProduction =
    env.nodeEnv === 'production' ||
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true';

  res.clearCookie(env.cookieName || 'cinehub_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
  res.status(204).send();
}

async function me(req, res, next) {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw ApiError.unauthorized();
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};