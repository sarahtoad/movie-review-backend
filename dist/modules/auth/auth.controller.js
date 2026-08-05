"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
const env_1 = require("../../config/env");
const auth_service_1 = require("./auth.service");
const prismaClient_1 = require("../../config/prismaClient");
const apiError_1 = require("../../utils/apiError");
function setAuthCookie(res, token) {
    // Always use sameSite: 'none' and secure: true in production / cross-origin setups
    const isProduction = env_1.env.nodeEnv === 'production' || process.env.NODE_ENV === 'production';
    res.cookie(env_1.env.cookieName || 'cinehub_token', token, {
        httpOnly: true,
        secure: isProduction, // MUST be true for cross-site cookies over HTTPS
        sameSite: isProduction ? 'none' : 'lax', // MUST be 'none' when Vercel & Render differ
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}
function toPublicUser(user) {
    const { passwordHash, ...rest } = user;
    return rest;
}
async function register(req, res, next) {
    try {
        const { user, token } = await (0, auth_service_1.registerUser)(req.body);
        setAuthCookie(res, token);
        // Return token in JSON response as fallback for localStorage / Bearer header
        res.status(201).json({ user: toPublicUser(user), token });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { user, token } = await (0, auth_service_1.loginUser)(req.body);
        setAuthCookie(res, token);
        // Return token in JSON response as fallback for localStorage / Bearer header
        res.json({ user: toPublicUser(user), token });
    }
    catch (err) {
        next(err);
    }
}
async function logout(_req, res) {
    res.clearCookie(env_1.env.cookieName, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
    });
    res.status(204).send();
}
async function me(req, res, next) {
    try {
        if (!req.user)
            throw apiError_1.ApiError.unauthorized();
        const user = await prismaClient_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            throw apiError_1.ApiError.unauthorized();
        res.json({ user: toPublicUser(user) });
    }
    catch (err) {
        next(err);
    }
}
