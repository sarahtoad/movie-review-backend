"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const apiError_1 = require("../utils/apiError");
function requireAdmin(req, _res, next) {
    if (req.user?.role !== 'ADMIN')
        return next(apiError_1.ApiError.forbidden('Réservé aux administrateurs'));
    next();
}
