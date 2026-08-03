"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    movieId: zod_1.z.string().min(1),
    rating: zod_1.z.number().int().min(1).max(10),
    content: zod_1.z.string().min(3).max(2000),
});
exports.updateReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(10).optional(),
    content: zod_1.z.string().min(3).max(2000).optional(),
});
