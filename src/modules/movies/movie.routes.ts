import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createMovieSchema } from './movie.schema';
import { postMovie, checkDuplicate, getMovie, getMovies, deleteMovieController, putMovie } from './movie.controller';

export const movieRoutes = Router();

movieRoutes.get('/', optionalAuth, getMovies);
movieRoutes.get('/check-duplicate', checkDuplicate);
movieRoutes.get('/:id', optionalAuth, getMovie);
movieRoutes.post('/', requireAuth, validate(createMovieSchema), postMovie);
movieRoutes.put('/:id', requireAuth, putMovie);
movieRoutes.delete('/:id', requireAuth, deleteMovieController);