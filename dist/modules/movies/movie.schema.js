"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovieSchema = void 0;
const zod_1 = require("zod");
exports.createMovieSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    posterUrl: zod_1.z.string().url().optional(),
    genres: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    year: zod_1.z.number().int().min(1888).max(new Date().getFullYear() + 2),
    synopsis: zod_1.z.string().max(3000).optional(),
    trailer: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    runtime: zod_1.z.number().int().positive().optional(),
    country: zod_1.z.string().max(100).optional(),
    director: zod_1.z.string().max(120).optional(),
    platforms: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        link: zod_1.z.string().url(),
    }))
        .optional()
        .default([]),
});
