import { prisma } from '../../config/prismaClient';

export async function globalSearch(query: string) {
  const q = query.trim();
  if (!q) return { movies: [], users: [], genres: [] };

  const [movies, users, genres] = await Promise.all([
    prisma.movie.findMany({
      where: { title: { contains: q, mode: 'insensitive' } },
      take: 8,
      select: { id: true, title: true, year: true, posterUrl: true, averageRating: true },
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 8,
      select: { id: true, username: true, name: true, avatar: true },
    }),
    prisma.genre.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 8 }),
  ]);

  return { movies, users, genres };
}
