"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const apiError_1 = require("../utils/apiError");
// Helper to extract token from either cookies or Authorization header
function extractToken(req) {
    const cookieToken = req.cookies?.[env_1.env.cookieName];
    let headerToken;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        headerToken = authHeader.slice(7).trim();
    }
    return cookieToken ?? headerToken;
}
function requireAuth(req, _res, next) {
    const token = extractToken(req);
    if (!token)
        return next(apiError_1.ApiError.unauthorized('Non authentifié'));
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = { id: payload.userId, role: payload.role };
        next();
    }
    catch {
        next(apiError_1.ApiError.unauthorized('Session invalide ou expirée'));
    }
}
function optionalAuth(req, _res, next) {
    const token = extractToken(req);
    if (token) {
        try {
            const payload = (0, jwt_1.verifyToken)(token);
            req.user = { id: payload.userId, role: payload.role };
        }
        catch {
            // Token invalide : on continue tranquillement en mode anonyme
        }
    }
    next();
}
