import { prisma } from '../../config/prismaClient';
import { logActivity } from '../activity/activity.service';

export async function toggleWatchlist(userId: string, movieId: string) {
  const existing = await prisma.watchlistItem.findUnique({ where: { userId_movieId: { userId, movieId } } });

  if (existing) {
    await prisma.watchlistItem.delete({ where: { id: existing.id } });
    return { onWatchlist: false };
  }

  await prisma.watchlistItem.create({ data: { userId, movieId } });
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  await logActivity(userId, 'WATCHLIST', `souhaite regarder ${movie?.title}`, { movieId });
  return { onWatchlist: true };
}

export async function listWatchlist(userId: string) {
  return prisma.watchlistItem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { movie: true } });
}
