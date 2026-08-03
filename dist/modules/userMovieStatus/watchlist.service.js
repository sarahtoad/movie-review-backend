"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWatchlist = toggleWatchlist;
exports.listWatchlist = listWatchlist;
const prismaClient_1 = require("../../config/prismaClient");
const activity_service_1 = require("../activity/activity.service");
async function toggleWatchlist(userId, movieId) {
    const existing = await prismaClient_1.prisma.watchlistItem.findUnique({ where: { userId_movieId: { userId, movieId } } });
    if (existing) {
        await prismaClient_1.prisma.watchlistItem.delete({ where: { id: existing.id } });
        return { onWatchlist: false };
    }
    await prismaClient_1.prisma.watchlistItem.create({ data: { userId, movieId } });
    const movie = await prismaClient_1.prisma.movie.findUnique({ where: { id: movieId } });
    await (0, activity_service_1.logActivity)(userId, 'WATCHLIST', `souhaite regarder ${movie?.title}`, { movieId });
    return { onWatchlist: true };
}
async function listWatchlist(userId) {
    return prismaClient_1.prisma.watchlistItem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { movie: true } });
}
