"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToWatchlist = addToWatchlist;
exports.removeFromWatchlist = removeFromWatchlist;
exports.getWatchlist = getWatchlist;
const prismaClient_1 = require("../../config/prismaClient");
const apiError_1 = require("../../utils/apiError");
const activity_service_1 = require("../activity/activity.service");
async function addToWatchlist(userId, movieId) {
    const exists = await prismaClient_1.prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId,
                movieId,
            },
        },
    });
    if (exists) {
        throw apiError_1.ApiError.conflict("Movie already in watchlist");
    }
    const watchlist = await prismaClient_1.prisma.watchlistItem.create({
        data: {
            userId,
            movieId,
        },
    });
    await (0, activity_service_1.logActivity)(userId, "WATCHLIST", "a ajouté un film à sa watchlist", {
        movieId,
    });
    return watchlist;
}
async function removeFromWatchlist(userId, movieId) {
    await prismaClient_1.prisma.watchlistItem.delete({
        where: {
            userId_movieId: {
                userId,
                movieId,
            },
        },
    });
}
async function getWatchlist(userId) {
    return prismaClient_1.prisma.watchlistItem.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            movie: {
                include: {
                    genres: {
                        include: {
                            genre: true,
                        },
                    },
                },
            },
        },
    });
}
