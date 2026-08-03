import { prisma } from '../../config/prismaClient';

export async function getDashboard(userId: string) {
  const [movies, reviews, favorites, watchlist, activity] = await Promise.all([
    prisma.movie.findMany({ where: { addedById: userId }, orderBy: { createdAt: 'desc' } }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { movie: { select: { id: true, title: true, posterUrl: true } }, likes: true },
    }),
    prisma.favorite.findMany({ where: { userId }, include: { movie: true } }),
    prisma.watchlistItem.findMany({ where: { userId }, include: { movie: true } }),
    prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 }),
  ]);

  return { movies, reviews, favorites, watchlist, activity };
}
