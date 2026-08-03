"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
    static badRequest(message, details) {
        return new ApiError(400, message, details);
    }
    static unauthorized(message = 'Non authentifié') {
        return new ApiError(401, message);
    }
    static forbidden(message = 'Accès refusé') {
        return new ApiError(403, message);
    }
    static notFound(message = 'Ressource introuvable') {
        return new ApiError(404, message);
    }
    static conflict(message, details) {
        return new ApiError(409, message, details);
    }
}
exports.ApiError = ApiError;
