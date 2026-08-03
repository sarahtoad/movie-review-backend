import { prisma } from '../../config/prismaClient';
import { ApiError } from '../../utils/apiError';
import { createNotification } from '../notifications/notification.service';

export async function toggleReviewLike(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw ApiError.notFound('Avis introuvable');

  const existing = await prisma.reviewLike.findUnique({ where: { userId_reviewId: { userId, reviewId } } });

  if (existing) {
    await prisma.reviewLike.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.reviewLike.create({ data: { userId, reviewId } });

  if (review.userId !== userId) {
    await createNotification({
      recipientId: review.userId,
      actorId: userId,
      type: 'LIKE',
      message: 'a aimé votre avis.',
      reviewId,
    });
  }

  return { liked: true };
}
