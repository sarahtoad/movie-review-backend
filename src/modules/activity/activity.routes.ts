import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { getFeed, getMyActivity } from './activity.controller';

export const activityRoutes = Router();

// Modifiez '/feed' par '/'
activityRoutes.get('/', getFeed);
activityRoutes.get('/me', requireAuth, getMyActivity);