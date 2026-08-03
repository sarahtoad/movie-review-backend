import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { ApiError } from '../../utils/apiError';
import { UpdateProfileInput } from './user.schema';

export async function getProfileByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { moviesAdded: true, reviews: true, watchlist: true } },
      reviews: { select: { likes: true } },
    },
  });

  if (!user) throw ApiError.notFound('Utilisateur introuvable');

  const likesReceived = user.reviews.reduce((sum, r) => sum + r.likes.length, 0);

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    banner: user.banner,
    bio: user.bio,
    location: user.location,
    createdAt: user.createdAt,
    stats: {
      moviesAdded: user._count.moviesAdded,
      reviewsCount: user._count.reviews,
      moviesWatched: user._count.reviews,
      toWatch: user._count.watchlist,
      likesReceived,
    },
  };
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput
) {
  // 1. Construire un objet de mise à jour qui ignore les valeurs 'undefined'
  const dataToUpdate: Prisma.UserUpdateInput = {};

  if (input.name !== undefined) dataToUpdate.name = input.name;
  if (input.username !== undefined) dataToUpdate.username = input.username;
  if (input.email !== undefined) dataToUpdate.email = input.email;
  if (input.bio !== undefined) dataToUpdate.bio = input.bio;
  if (input.location !== undefined) dataToUpdate.location = input.location;
  if (input.avatar !== undefined) dataToUpdate.avatar = input.avatar;
  if (input.banner !== undefined) dataToUpdate.banner = input.banner;

  // 2. Vérifier l'unicité si l'username ou l'email est modifié
  if (input.username || input.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              ...(input.username ? [{ username: input.username }] : []),
              ...(input.email ? [{ email: input.email }] : []),
            ],
          },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === input.username) {
        throw ApiError.badRequest("Ce nom d'utilisateur est déjà pris.");
      }
      if (existingUser.email === input.email) {
        throw ApiError.badRequest("Cet email est déjà utilisé.");
      }
    }
  }

  // 3. Exécuter la mise à jour
  return prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
  });
}