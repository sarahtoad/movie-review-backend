"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = toggleFavorite;
exports.listFavorites = listFavorites;
const prismaClient_1 = require("../../config/prismaClient");
const activity_service_1 = require("../activity/activity.service");
async function toggleFavorite(userId, movieId) {
    const existing = await prismaClient_1.prisma.favorite.findUnique({ where: { userId_movieId: { userId, movieId } } });
    if (existing) {
        await prismaClient_1.prisma.favorite.delete({ where: { id: existing.id } });
        return { favorited: false };
    }
    await prismaClient_1.prisma.favorite.create({ data: { userId, movieId } });
    const movie = await prismaClient_1.prisma.movie.findUnique({ where: { id: movieId } });
    await (0, activity_service_1.logActivity)(userId, 'FAVORITE', `a ajouté ${movie?.title} à ses favoris`, { movieId });
    return { favorited: true };
}
async function listFavorites(userId) {
    return prismaClient_1.prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { movie: true } });
}
