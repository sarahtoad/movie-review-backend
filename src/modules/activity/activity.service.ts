import { prisma } from "../../config/prismaClient";
import { ActivityType } from "@prisma/client";

/**
 * Enregistre une nouvelle activité en base de données.
 */
export async function logActivity(
  userId: string,
  type: ActivityType,
  description: string,
  refs?: { movieId?: string; reviewId?: string }
) {
  return prisma.activity.create({
    data: {
      userId,
      type,
      description,
      movieId: refs?.movieId,
      reviewId: refs?.reviewId,
    },
  });
}

/**
 * Récupère le fil d'actualité global de la communauté.
 */
export async function getGlobalActivity(limit = 30) {
  return prisma.activity.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

/**
 * Récupère l'historique d'activité d'un utilisateur spécifique.
 */
export async function getUserActivity(userId: string, limit = 50) {
  return prisma.activity.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}