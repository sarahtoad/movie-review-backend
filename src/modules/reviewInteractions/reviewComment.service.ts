import { prisma } from '../../config/prismaClient';
import { ApiError } from '../../utils/apiError';
import { createNotification } from '../notifications/notification.service';

export async function addComment(reviewId: string, userId: string, content: string, parentId?: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw ApiError.notFound('Avis introuvable');

  let recipientId = review.userId;

  if (parentId) {
    const parent = await prisma.reviewComment.findUnique({ where: { id: parentId } });
    if (!parent || parent.reviewId !== reviewId) throw ApiError.badRequest('Commentaire parent invalide');
    recipientId = parent.userId;
  }

  const comment = await prisma.reviewComment.create({
    data: { reviewId, userId, content, parentId },
    include: { user: { select: { id: true, username: true, name: true, avatar: true } } },
  });

  if (recipientId !== userId) {
    await createNotification({
      recipientId,
      actorId: userId,
      type: 'COMMENT',
      message: parentId ? 'a répondu à votre commentaire.' : 'a commenté votre avis.',
      reviewId,
    });
  }

  return comment;
}

async function assertCommentOwner(commentId: string, userId: string) {
  const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!comment) throw ApiError.notFound('Commentaire introuvable');
  if (comment.userId !== userId) throw ApiError.forbidden('Vous ne pouvez modifier que vos propres commentaires.');
  return comment;
}

export async function editComment(commentId: string, userId: string, content: string) {
  await assertCommentOwner(commentId, userId);
  return prisma.reviewComment.update({ where: { id: commentId }, data: { content } });
}

export async function removeComment(commentId: string, userId: string) {
  await assertCommentOwner(commentId, userId);
  await prisma.reviewComment.delete({ where: { id: commentId } });
}
