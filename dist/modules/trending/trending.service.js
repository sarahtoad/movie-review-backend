"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrending = getTrending;
const prismaClient_1 = require("../../config/prismaClient");
async function getTrending() {
    const [popular, topRated, mostCommented, latest] = await Promise.all([
        prismaClient_1.prisma.movie.findMany({ orderBy: { favorites: { _count: 'desc' } }, take: 10 }),
        prismaClient_1.prisma.movie.findMany({ where: { reviewsCount: { gt: 0 } }, orderBy: { averageRating: 'desc' }, take: 10 }),
        prismaClient_1.prisma.movie.findMany({ orderBy: { reviewsCount: 'desc' }, take: 10 }),
        prismaClient_1.prisma.movie.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);
    return { popular, topRated, mostCommented, latest };
}
