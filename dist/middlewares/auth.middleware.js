const { env } = require('../config/env');
const { verifyToken } = require('../utils/jwt');
const { ApiError } = require('../utils/apiError');

function extractToken(req) {
  const cookieName = env.cookieName || 'cinehub_token';
  const cookieToken = req.cookies?.[cookieName];

  let headerToken;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    headerToken = authHeader.slice(7).trim();
  }

  return cookieToken || headerToken;
}

function requireAuth(req, _res, next) {
  const token = extractToken(req);

  if (!token) {
    return next(ApiError.unauthorized('Non authentifié'));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    next(ApiError.unauthorized('Session invalide ou expirée'));
  }
}

function optionalAuth(req, _res, next) {
  const token = extractToken(req);

  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = { id: payload.userId, role: payload.role };
    } catch (err) {
      // Ignorer l'erreur pour continuer en tant qu'invité
    }
  }

  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
};