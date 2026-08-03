"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findExistingMovie = findExistingMovie;
exports.createMovie = createMovie;
exports.getMovieById = getMovieById;
exports.listMovies = listMovies;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;
const prismaClient_1 = require("../../config/prismaClient");
const apiError_1 = require("../../utils/apiError");
const genre_service_1 = require("../genres/genre.service");
const activity_service_1 = require("../activity/activity.service");
async function findExistingMovie(title, year) {
    return prismaClient_1.prisma.movie.findUnique({
        where: {
            title_year: {
                title,
                year,
            },
        },
    });
}
async function createMovie(userId, input) {
    const existingMovie = await findExistingMovie(input.title, input.year);
    if (existingMovie) {
        throw apiError_1.ApiError.conflict("Ce film existe déjà.");
    }
    const genres = await (0, genre_service_1.findOrCreateGenres)(input.genres);
    const movie = await prismaClient_1.prisma.movie.create({
        data: {
            title: input.title,
            year: input.year,
            posterUrl: input.posterUrl,
            synopsis: input.synopsis,
            trailer: input.trailer,
            runtime: input.runtime,
            country: input.country,
            director: input.director,
            addedById: userId,
            genres: {
                create: genres.map((genre) => ({
                    genreId: genre.id,
                })),
            },
            platforms: input.platforms && input.platforms.length > 0
                ? {
                    create: input.platforms,
                }
                : undefined,
        },
        include: {
            genres: {
                include: {
                    genre: true,
                },
            },
            platforms: true,
            addedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                },
            },
        },
    });
    await (0, activity_service_1.logActivity)(userId, "MOVIE", `a ajouté le film ${movie.title}`, {
        movieId: movie.id,
    });
    return movie;
}
async function getMovieById(movieId, currentUserId) {
    const movie = await prismaClient_1.prisma.movie.findUnique({
        where: {
            id: movieId,
        },
        include: {
            addedBy: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                },
            },
            genres: {
                include: {
                    genre: true,
                },
            },
            platforms: true,
            images: true,
            favorites: currentUserId
                ? {
                    where: {
                        userId: currentUserId,
                    },
                }
                : false,
            watchlist: currentUserId
                ? {
                    where: {
                        userId: currentUserId,
                    },
                }
                : false,
            reviews: currentUserId
                ? {
                    where: {
                        userId: currentUserId,
                    },
                }
                : false,
        },
    });
    if (!movie) {
        throw apiError_1.ApiError.notFound("Film introuvable");
    }
    return {
        ...movie,
        isFavorite: Array.isArray(movie.favorites) &&
            movie.favorites.length > 0,
        isWatchlist: Array.isArray(movie.watchlist) &&
            movie.watchlist.length > 0,
        hasReviewed: Array.isArray(movie.reviews) &&
            movie.reviews.length > 0,
    };
}
async function listMovies(params) {
    const { skip, limit, genre, sort, currentUserId, } = params;
    const where = genre
        ? {
            genres: {
                some: {
                    genre: {
                        name: genre,
                    },
                },
            },
        }
        : {};
    const orderBy = sort === "top-rated"
        ? [{ averageRating: "desc" }]
        : sort === "most-reviewed"
            ? [{ reviews: { _count: "desc" } }] // Tri direct par le nombre réel d'avis
            : [{ createdAt: "desc" }];
    const [movies, total] = await Promise.all([
        prismaClient_1.prisma.movie.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                // Compte le nombre réel de révisions directement dans la BDD
                _count: {
                    select: {
                        reviews: true,
                    },
                },
                genres: {
                    include: {
                        genre: true,
                    },
                },
                addedBy: {
                    select: {
                        username: true,
                    },
                },
                favorites: currentUserId
                    ? {
                        where: {
                            userId: currentUserId,
                        },
                    }
                    : false,
                watchlist: currentUserId
                    ? {
                        where: {
                            userId: currentUserId,
                        },
                    }
                    : false,
            },
        }),
        prismaClient_1.prisma.movie.count({
            where,
        }),
    ]);
    return {
        movies: movies.map((movie) => ({
            ...movie,
            reviewsCount: movie._count.reviews, // Envoie le vrai nombre exact d'avis
            isFavorite: Array.isArray(movie.favorites) &&
                movie.favorites.length > 0,
            isWatchlist: Array.isArray(movie.watchlist) &&
                movie.watchlist.length > 0,
        })),
        total,
    };
}
// ... (gardez votre code existant au début du fichier)
async function updateMovie(movieId, userId, input) {
    const movie = await prismaClient_1.prisma.movie.findUnique({
        where: { id: movieId },
    });
    if (!movie) {
        throw apiError_1.ApiError.notFound("Film introuvable.");
    }
    // Vérification de sécurité : seul l'auteur peut modifier le film
    if (movie.addedById !== userId) {
        throw apiError_1.ApiError.forbidden("Vous n'avez pas la permission de modifier ce film.");
    }
    const updatedMovie = await prismaClient_1.prisma.movie.update({
        where: { id: movieId },
        data: {
            title: input.title,
            year: input.year,
            runtime: input.runtime,
            synopsis: input.synopsis,
            posterUrl: input.posterUrl,
        },
    });
    return updatedMovie;
}
async function deleteMovie(movieId, userId) {
    const movie = await prismaClient_1.prisma.movie.findUnique({
        where: { id: movieId },
    });
    if (!movie) {
        throw apiError_1.ApiError.notFound("Film introuvable.");
    }
    // Vérification de sécurité : seul l'auteur peut supprimer le film
    if (movie.addedById !== userId) {
        throw apiError_1.ApiError.forbidden("Vous n'avez pas la permission de supprimer ce film.");
    }
    // Suppression en cascade automatique via Prisma
    await prismaClient_1.prisma.movie.delete({
        where: { id: movieId },
    });
    return { message: "Film supprimé avec succès." };
}
