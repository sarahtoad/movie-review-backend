import { prisma } from "../../config/prismaClient";
import { logActivity } from "../activity/activity.service";

export async function createFavorite(
  userId: string,
  movieId: string
) {
  const favorite = await prisma.favorite.create({
    data: {
      userId,
      movieId,
    },
  });

  await logActivity(
    userId,
    "FAVORITE",
    "a ajouté un film à ses favoris",
    { movieId }
  );

  return favorite;
}

export async function deleteFavorite(
  userId: string,
  movieId: string
) {
  return prisma.favorite.delete({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });
}