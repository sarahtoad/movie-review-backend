import { Router } from 'express';
import { getTrending } from './trending.service';

export const trendingRoutes = Router();

trendingRoutes.get('/', async (_req, res, next) => {
  try {
    res.json(await getTrending());
  } catch (err) {
    next(err);
  }
});
