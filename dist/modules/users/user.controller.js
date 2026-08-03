"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.patchProfile = patchProfile;
exports.getCurrentUser = getCurrentUser;
const prismaClient_1 = require("../../config/prismaClient");
const user_service_1 = require("./user.service");
async function getProfile(req, res, next) {
    try {
        const username = typeof req.params.username === "string"
            ? req.params.username
            : req.params.username[0];
        res.json(await (0, user_service_1.getProfileByUsername)(username));
    }
    catch (err) {
        next(err);
    }
}
async function patchProfile(req, res, next) {
    try {
        const files = req.files;
        const host = `${req.protocol}://${req.get("host")}`;
        const avatarUrl = files?.avatar?.[0]
            ? `${host}/uploads/${files.avatar[0].filename}`
            : req.body.avatar;
        const bannerUrl = files?.banner?.[0]
            ? `${host}/uploads/${files.banner[0].filename}`
            : req.body.banner;
        const updatePayload = {
            ...req.body,
            ...(avatarUrl !== undefined && { avatar: avatarUrl }),
            ...(bannerUrl !== undefined && { banner: bannerUrl }),
        };
        const user = await (0, user_service_1.updateProfile)(req.user.id, updatePayload);
        const { passwordHash, ...safeUser } = user;
        res.json(safeUser);
    }
    catch (err) {
        next(err);
    }
}
async function getCurrentUser(req, res, next) {
    try {
        const user = await prismaClient_1.prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatar: true,
                banner: true,
                bio: true,
                location: true,
                createdAt: true,
                moviesAdded: {
                    include: {
                        genres: {
                            include: {
                                genre: true,
                            },
                        },
                    },
                },
                reviews: {
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
                        likes: true,
                        comments: true,
                    },
                },
                favorites: {
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
                },
                watchlist: {
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
                },
                activities: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 10,
                    include: {
                        movie: {
                            select: {
                                id: true,
                                title: true,
                                posterUrl: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({
                error: "Utilisateur introuvable",
            });
        }
        const activities = user.activities.map((activity) => ({
            id: activity.id,
            type: activity.type.toLowerCase(),
            movie: activity.movie?.title ?? "Film",
            movieId: activity.movie?.id ?? "",
            poster: activity.movie?.posterUrl ?? "/images/default-movie.jpg",
            date: new Date(activity.createdAt).toLocaleDateString("fr-FR"),
            description: activity.description,
        }));
        res.json({
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                banner: user.banner,
                bio: user.bio,
                location: user.location,
                createdAt: user.createdAt,
                moviesAdded: user.moviesAdded,
                favorites: user.favorites,
                reviews: user.reviews,
                watchlist: user.watchlist,
            },
            stats: {
                movies: user.moviesAdded.length,
                reviews: user.reviews.length,
                favorites: user.favorites.length,
                watchlist: user.watchlist.length,
                likes: 0, // à remplacer plus tard par le vrai nombre de likes
            },
            activities,
        });
    }
    catch (err) {
        next(err);
    }
}
