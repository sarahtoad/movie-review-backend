"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFavorite = createFavorite;
exports.deleteFavorite = deleteFavorite;
const prismaClient_1 = require("../../config/prismaClient");
const activity_service_1 = require("../activity/activity.service");
async function createFavorite(userId, movieId) {
    const favorite = await prismaClient_1.prisma.favorite.create({
        data: {
            userId,
            movieId,
        },
    });
    await (0, activity_service_1.logActivity)(userId, "FAVORITE", "a ajouté un film à ses favoris", { movieId });
    return favorite;
}
async function deleteFavorite(userId, movieId) {
    return prismaClient_1.prisma.favorite.delete({
        where: {
            userId_movieId: {
                userId,
                movieId,
            },
        },
    });
}
