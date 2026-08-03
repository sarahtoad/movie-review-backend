import { z } from 'zod';

export const createReviewSchema = z.object({
  movieId: z.string().min(1),
  rating: z.number().int().min(1).max(10),
  content: z.string().min(3).max(2000),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(10).optional(),
  content: z.string().min(3).max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
