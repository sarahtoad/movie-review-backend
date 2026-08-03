"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileByUsername = getProfileByUsername;
exports.updateProfile = updateProfile;
const prismaClient_1 = require("../../config/prismaClient");
const apiError_1 = require("../../utils/apiError");
async function getProfileByUsername(username) {
    const user = await prismaClient_1.prisma.user.findUnique({
        where: { username },
        include: {
            _count: { select: { moviesAdded: true, reviews: true, watchlist: true } },
            reviews: { select: { likes: true } },
        },
    });
    if (!user)
        throw apiError_1.ApiError.notFound('Utilisateur introuvable');
    const likesReceived = user.reviews.reduce((sum, r) => sum + r.likes.length, 0);
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        banner: user.banner,
        bio: user.bio,
        location: user.location,
        createdAt: user.createdAt,
        stats: {
            moviesAdded: user._count.moviesAdded,
            reviewsCount: user._count.reviews,
            moviesWatched: user._count.reviews,
            toWatch: user._count.watchlist,
            likesReceived,
        },
    };
}
async function updateProfile(userId, input) {
    // 1. Construire un objet de mise à jour qui ignore les valeurs 'undefined'
    const dataToUpdate = {};
    if (input.name !== undefined)
        dataToUpdate.name = input.name;
    if (input.username !== undefined)
        dataToUpdate.username = input.username;
    if (input.email !== undefined)
        dataToUpdate.email = input.email;
    if (input.bio !== undefined)
        dataToUpdate.bio = input.bio;
    if (input.location !== undefined)
        dataToUpdate.location = input.location;
    if (input.avatar !== undefined)
        dataToUpdate.avatar = input.avatar;
    if (input.banner !== undefined)
        dataToUpdate.banner = input.banner;
    // 2. Vérifier l'unicité si l'username ou l'email est modifié
    if (input.username || input.email) {
        const existingUser = await prismaClient_1.prisma.user.findFirst({
            where: {
                AND: [
                    { id: { not: userId } },
                    {
                        OR: [
                            ...(input.username ? [{ username: input.username }] : []),
                            ...(input.email ? [{ email: input.email }] : []),
                        ],
                    },
                ],
            },
        });
        if (existingUser) {
            if (existingUser.username === input.username) {
                throw apiError_1.ApiError.badRequest("Ce nom d'utilisateur est déjà pris.");
            }
            if (existingUser.email === input.email) {
                throw apiError_1.ApiError.badRequest("Cet email est déjà utilisé.");
            }
        }
    }
    // 3. Exécuter la mise à jour
    return prismaClient_1.prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
    });
}
