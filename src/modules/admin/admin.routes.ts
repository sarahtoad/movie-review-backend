import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/requireAdmin.middleware';
import { getUsers, removeUser, removeReview, removeComment, patchMovie } from './admin.controller';

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);
adminRoutes.get('/users', getUsers);
adminRoutes.delete('/users/:id', removeUser);
adminRoutes.delete('/reviews/:id', removeReview);
adminRoutes.delete('/comments/:id', removeComment);
adminRoutes.patch('/movies/:id', patchMovie);
