import { Router } from 'express';
import { globalSearch } from './search.service';

export const searchRoutes = Router();

searchRoutes.get('/', async (req, res, next) => {
  try {
    res.json(await globalSearch(String(req.query.q ?? '')));
  } catch (err) {
    next(err);
  }
});
