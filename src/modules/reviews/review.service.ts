import { prisma } from '../../config/prismaClient';

interface CreateReviewInput {
  movieId: string;
  rating: number;
  content: string;
}

export async function createReview(userId: string, data: CreateReviewInput) {
  return prisma.review.create({
    data: {
      userId,
      movieId: data.movieId,
      rating: Number(data.rating),
      content: data.content,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function listReviewsForMovie(movieId: string) {
  return prisma.review.findMany({
    where: { movieId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Add these functions to your review.service.ts file

export async function updateReview(
  reviewId: string,
  userId: string,
  data: { rating?: number; content?: string }
) {
  // Option 1: Ensure the user updating the review is the owner
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Unauthorized to edit this review");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(data.rating !== undefined && { rating: Number(data.rating) }),
      ...(data.content !== undefined && { content: data.content }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function deleteReview(reviewId: string, userId: string) {
  // Option 1: Verify ownership before deletion
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Unauthorized to delete this review");
  }

  return prisma.review.delete({
    where: { id: reviewId },
  });
}