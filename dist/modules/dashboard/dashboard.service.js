"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
const prismaClient_1 = require("../../config/prismaClient");
async function getDashboard(userId) {
    const [movies, reviews, favorites, watchlist, activity] = await Promise.all([
        prismaClient_1.prisma.movie.findMany({ where: { addedById: userId }, orderBy: { createdAt: 'desc' } }),
        prismaClient_1.prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { movie: { select: { id: true, title: true, posterUrl: true } }, likes: true },
        }),
        prismaClient_1.prisma.favorite.findMany({ where: { userId }, include: { movie: true } }),
        prismaClient_1.prisma.watchlistItem.findMany({ where: { userId }, include: { movie: true } }),
        prismaClient_1.prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 }),
    ]);
    return { movies, reviews, favorites, watchlist, activity };
}
