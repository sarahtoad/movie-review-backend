"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80).optional(),
    username: zod_1.z.string().min(3).max(40).regex(/^[a-zA-Z0-9_]+$/, "Nom d'utilisateur invalide").optional(),
    email: zod_1.z.string().email().optional(),
    bio: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(100).optional(),
    avatar: zod_1.z.string().url().optional(),
    banner: zod_1.z.string().url().optional(),
});
