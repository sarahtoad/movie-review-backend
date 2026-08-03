import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z.string().min(1).max(255),
  posterUrl: z.string().url().optional(),
  genres: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(1888).max(new Date().getFullYear() + 2),
  synopsis: z.string().max(3000).optional(),
  trailer: z.string().url().optional().or(z.literal("")),
  runtime: z.number().int().positive().optional(),
  country: z.string().max(100).optional(),
  director: z.string().max(120).optional(),
  platforms: z
  .array(
    z.object({
      name: z.string().min(1),
      link: z.string().url(),
    })
  )
  .optional()
  .default([]),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
