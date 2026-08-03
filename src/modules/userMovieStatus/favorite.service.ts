import { prisma } from '../../config/prismaClient';
import { logActivity } from '../activity/activity.service';

export async function toggleFavorite(userId: string, movieId: string) {
  const existing = await prisma.favorite.findUnique({ where: { userId_movieId: { userId, movieId } } });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { userId, movieId } });
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  await logActivity(userId, 'FAVORITE', `a ajouté ${movie?.title} à ses favoris`, { movieId });
  return { favorited: true };
}

export async function listFavorites(userId: string) {
  return prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { movie: true } });
}
