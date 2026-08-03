import { prisma } from "../../config/prismaClient";
import { ApiError } from "../../utils/apiError";
import { logActivity } from "../activity/activity.service";

export async function addToWatchlist(userId: string, movieId: string) {
  const exists = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });

  if (exists) {
    throw ApiError.conflict("Movie already in watchlist");
  }

  const watchlist = await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
    },
  });

  await logActivity(
    userId,
    "WATCHLIST",
    "a ajouté un film à sa watchlist",
    {
      movieId,
    }
  );

  return watchlist;
}

export async function removeFromWatchlist(
  userId: string,
  movieId: string
) {
  await prisma.watchlistItem.delete({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });
}

export async function getWatchlist(userId: string) {
  return prisma.watchlistItem.findMany({
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