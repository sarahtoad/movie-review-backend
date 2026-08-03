"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80),
    username: zod_1.z
        .string()
        .min(3)
        .max(40)
        .regex(/^[a-z0-9_.]+$/i, 'Lettres, chiffres, _ et . uniquement'),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, 'Minimum 8 caractères'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
