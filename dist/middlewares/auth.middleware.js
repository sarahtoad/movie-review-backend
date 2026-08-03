"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const apiError_1 = require("../utils/apiError");
function requireAuth(req, _res, next) {
    const cookieToken = req.cookies?.[env_1.env.cookieName];
    const headerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : undefined;
    const token = cookieToken ?? headerToken;
    if (!token)
        return next(apiError_1.ApiError.unauthorized());
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
    const cookieToken = req.cookies?.[env_1.env.cookieName];
    if (!cookieToken)
        return next();
    try {
        const payload = (0, jwt_1.verifyToken)(cookieToken);
        req.user = { id: payload.userId, role: payload.role };
    }
    catch {
        // token invalide : on continue en mode anonyme
    }
    next();
}
