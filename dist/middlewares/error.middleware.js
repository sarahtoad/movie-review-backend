"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
exports.notFoundMiddleware = notFoundMiddleware;
const apiError_1 = require("../utils/apiError");
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({ error: err.message, details: err.details ?? null });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
}
function notFoundMiddleware(_req, res) {
    res.status(404).json({ error: 'Route introuvable' });
}
