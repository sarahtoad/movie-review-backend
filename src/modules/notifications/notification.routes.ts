import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { getNotifications, getUnreadCount, patchRead, patchReadAll } from './notification.controller';

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth);
notificationRoutes.get('/', getNotifications);
notificationRoutes.get('/unread-count', getUnreadCount);
notificationRoutes.patch('/:id/read', patchRead);
notificationRoutes.patch('/read-all', patchReadAll);
