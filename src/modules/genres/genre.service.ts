import { prisma } from '../../config/prismaClient';

export async function listGenres() {
  return prisma.genre.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { movies: true } } },
  });
}

export async function findOrCreateGenres(names: string[]) {
  const genres = [];
  for (const name of names) {
    const genre = await prisma.genre.upsert({ where: { name }, update: {}, create: { name } });
    genres.push(genre);
  }
  return genres;
}
