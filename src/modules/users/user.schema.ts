import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9_]+$/, "Nom d'utilisateur invalide").optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;