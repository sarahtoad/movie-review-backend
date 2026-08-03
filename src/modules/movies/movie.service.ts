import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../utils/apiError";
import { findOrCreateGenres } from "../genres/genre.service";
import { logActivity } from "../activity/activity.service";
import { CreateMovieInput } from "./movie.schema";

export async function findExistingMovie(title: string, year: number) {
  return prisma.movie.findUnique({
    where: {
      title_year: {
        title,
        year,
      },
    },
  });
}

export async function createMovie(
  userId: string,
  input: CreateMovieInput
) {
  const existingMovie = await findExistingMovie(
    input.title,
    input.year
  );

  if (existingMovie) {
    throw ApiError.conflict("Ce film existe déjà.");
  }

  const genres = await findOrCreateGenres(input.genres);

  const movie = await prisma.movie.create({
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

      platforms:
        input.platforms && input.platforms.length > 0
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

  await logActivity(
    userId,
    "MOVIE",
    `a ajouté le film ${movie.title}`,
    {
      movieId: movie.id,
    }
  );

  return movie;
}

export async function getMovieById(
  movieId: string,
  currentUserId?: string
) {
  const movie = await prisma.movie.findUnique({
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
    throw ApiError.notFound("Film introuvable");
  }

  return {
    ...movie,
    isFavorite:
      Array.isArray(movie.favorites) &&
      movie.favorites.length > 0,

    isWatchlist:
      Array.isArray(movie.watchlist) &&
      movie.watchlist.length > 0,

    hasReviewed:
      Array.isArray(movie.reviews) &&
      movie.reviews.length > 0,
  };
}

export async function listMovies(params: {
  skip: number;
  limit: number;
  genre?: string;
  sort?: string;
  currentUserId?: string;
}) {
  const {
    skip,
    limit,
    genre,
    sort,
    currentUserId,
  } = params;

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

  const orderBy =
    sort === "top-rated"
      ? [{ averageRating: "desc" as const }]
      : sort === "most-reviewed"
      ? [{ reviews: { _count: "desc" as const } }] // Tri direct par le nombre réel d'avis
      : [{ createdAt: "desc" as const }];

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
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

    prisma.movie.count({
      where,
    }),
  ]);

  return {
    movies: movies.map((movie) => ({
      ...movie,
      reviewsCount: movie._count.reviews, // Envoie le vrai nombre exact d'avis

      isFavorite:
        Array.isArray(movie.favorites) &&
        movie.favorites.length > 0,

      isWatchlist:
        Array.isArray(movie.watchlist) &&
        movie.watchlist.length > 0,
    })),

    total,
  };
}

// ... (gardez votre code existant au début du fichier)

export async function updateMovie(
  movieId: string,
  userId: string,
  input: Partial<CreateMovieInput>
) {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw ApiError.notFound("Film introuvable.");
  }

  // Vérification de sécurité : seul l'auteur peut modifier le film
  if (movie.addedById !== userId) {
    throw ApiError.forbidden("Vous n'avez pas la permission de modifier ce film.");
  }

  const updatedMovie = await prisma.movie.update({
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

export async function deleteMovie(movieId: string, userId: string) {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw ApiError.notFound("Film introuvable.");
  }

  // Vérification de sécurité : seul l'auteur peut supprimer le film
  if (movie.addedById !== userId) {
    throw ApiError.forbidden("Vous n'avez pas la permission de supprimer ce film.");
  }

  // Suppression en cascade automatique via Prisma
  await prisma.movie.delete({
    where: { id: movieId },
  });

  return { message: "Film supprimé avec succès." };
}