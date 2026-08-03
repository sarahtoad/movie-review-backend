import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const yanis = await prisma.user.create({
    data: {
      name: 'Yanis Belkacem',
      username: 'yanisb',
      email: 'yanis@example.com',
      passwordHash,
      bio: 'Cinéphile de drames scandinaves et de science-fiction des années 70.',
    },
  });

  const drame = await prisma.genre.create({ data: { name: 'Drame' } });

  const movie = await prisma.movie.create({
    data: {
      title: 'Les Évadés du Silence',
      year: 2019,
      synopsis:
        "Dans une petite ville portuaire, un gardien de phare retrouve la trace d'une lettre jamais envoyée, vingt ans après la disparition de son frère.",
      posterUrl: 'https://example.com/poster.jpg',
      runtime: 131,
      country: 'France',
      director: 'Amine Bouzid',
      addedById: yanis.id,
      genres: { create: [{ genreId: drame.id }] },
      platforms: { create: [{ name: 'Netflix', link: 'https://netflix.com' }] },
    },
  });

  await prisma.review.create({
    data: {
      movieId: movie.id,
      userId: yanis.id,
      rating: 9,
      content: "Le scénario est incroyable. J'ai adoré la musique de Hans Zimmer.",
    },
  });

  await prisma.movie.update({
    where: { id: movie.id },
    data: { averageRating: 9, reviewsCount: 1 },
  });

  console.log('Seed terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
