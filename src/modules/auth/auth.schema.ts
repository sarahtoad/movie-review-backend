import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  username: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9_.]+$/i, 'Lettres, chiffres, _ et . uniquement'),
  email: z.string().email(),
  password: z.string().min(8, 'Minimum 8 caractères'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
