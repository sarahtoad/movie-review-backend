import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { getDashboard } from './dashboard.service';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    res.json(await getDashboard(req.user!.id));
  } catch (err) {
    next(err);
  }
});
