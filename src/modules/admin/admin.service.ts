import { prisma } from '../../config/prismaClient';

export async function deleteUserAccount(userId: string) {
  return prisma.user.delete({ where: { id: userId } });
}

export async function deleteReviewContent(reviewId: string) {
  return prisma.review.delete({ where: { id: reviewId } });
}

export async function deleteCommentContent(commentId: string) {
  return prisma.reviewComment.delete({ where: { id: commentId } });
}

export async function updateMovieInfo(movieId: string, data: Record<string, unknown>) {
  return prisma.movie.update({ where: { id: movieId }, data });
}

export async function listAllUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}
