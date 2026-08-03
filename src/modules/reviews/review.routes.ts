import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createReviewSchema, updateReviewSchema } from './review.schema';
import { postReview, getMovieReviews, patchReview, removeReview } from './review.controller';

// mergeParams: true ensures :movieId passes down from app.use('/api/movies/:movieId/reviews')
export const reviewRoutes = Router({ mergeParams: true });

// Matches GET /api/movies/:movieId/reviews  AND  GET /api/reviews/movie/:movieId
reviewRoutes.get('/', getMovieReviews);
reviewRoutes.get('/movie/:movieId', getMovieReviews);

// Matches POST /api/movies/:movieId/reviews  AND  POST /api/reviews
reviewRoutes.post('/', requireAuth, validate(createReviewSchema), postReview);

// Matches PATCH /api/reviews/:id  AND  DELETE /api/reviews/:id
reviewRoutes.patch('/:id', requireAuth, validate(updateReviewSchema), patchReview);
reviewRoutes.delete('/:id', requireAuth, removeReview);