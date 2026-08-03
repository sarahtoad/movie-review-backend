import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { register, login, logout, me } from './auth.controller';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), register);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.post('/logout', logout);
authRoutes.get('/me', requireAuth, me);
