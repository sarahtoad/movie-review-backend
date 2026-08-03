import { prisma } from '../../config/prismaClient';

export async function getTrending() {
  const [popular, topRated, mostCommented, latest] = await Promise.all([
    prisma.movie.findMany({ orderBy: { favorites: { _count: 'desc' } }, take: 10 }),
    prisma.movie.findMany({ where: { reviewsCount: { gt: 0 } }, orderBy: { averageRating: 'desc' }, take: 10 }),
    prisma.movie.findMany({ orderBy: { reviewsCount: 'desc' }, take: 10 }),
    prisma.movie.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return { popular, topRated, mostCommented, latest };
}
