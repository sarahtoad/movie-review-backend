"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = logActivity;
exports.getGlobalActivity = getGlobalActivity;
exports.getUserActivity = getUserActivity;
const prismaClient_1 = require("../../config/prismaClient");
/**
 * Enregistre une nouvelle activité en base de données.
 */
async function logActivity(userId, type, description, refs) {
    return prismaClient_1.prisma.activity.create({
        data: {
            userId,
            type,
            description,
            movieId: refs?.movieId,
            reviewId: refs?.reviewId,
        },
    });
}
/**
 * Récupère le fil d'actualité global de la communauté.
 */
async function getGlobalActivity(limit = 30) {
    return prismaClient_1.prisma.activity.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatar: true,
                },
            },
            movie: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
}
/**
 * Récupère l'historique d'activité d'un utilisateur spécifique.
 */
async function getUserActivity(userId, limit = 50) {
    return prismaClient_1.prisma.activity.findMany({
        where: { userId },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            movie: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
}
