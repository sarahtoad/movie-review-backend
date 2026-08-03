"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const apiError_1 = require("../utils/apiError");
function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(apiError_1.ApiError.badRequest('Données invalides', result.error.flatten()));
        }
        req.body = result.data;
        next();
    };
}
