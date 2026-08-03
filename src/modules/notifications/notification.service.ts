import { prisma } from '../../config/prismaClient';
import { NotificationType } from '@prisma/client';

interface CreateNotificationInput {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  message: string;
  movieId?: string;
  reviewId?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  if (input.recipientId === input.actorId) return null;
  return prisma.notification.create({ data: input });
}

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      actor: { select: { id: true, username: true, name: true, avatar: true } },
      movie: { select: { id: true, title: true } },
    },
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, recipientId: userId },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({ where: { recipientId: userId, read: false }, data: { read: true } });
}

export async function countUnread(userId: string) {
  return prisma.notification.count({ where: { recipientId: userId, read: false } });
}
