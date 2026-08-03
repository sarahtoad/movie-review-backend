import { Router } from 'express';
import { listGenres } from './genre.service';

export const genreRoutes = Router();

genreRoutes.get('/', async (_req, res, next) => {
  try {
    res.json(await listGenres());
  } catch (err) {
    next(err);
  }
});
