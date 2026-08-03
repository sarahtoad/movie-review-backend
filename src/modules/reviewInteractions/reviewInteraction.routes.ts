import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { postReviewLike } from './reviewLike.controller';
import { postComment, patchComment, deleteComment } from './reviewComment.controller';

export const reviewInteractionRoutes = Router();

reviewInteractionRoutes.post('/:reviewId/like', requireAuth, postReviewLike);
reviewInteractionRoutes.post('/:reviewId/comments', requireAuth, postComment);
reviewInteractionRoutes.patch('/comments/:id', requireAuth, patchComment);
reviewInteractionRoutes.delete('/comments/:id', requireAuth, deleteComment);
