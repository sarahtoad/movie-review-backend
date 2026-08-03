import { Request, Response, NextFunction } from 'express';
import { toggleReviewLike } from './reviewLike.service';

export async function postReviewLike(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await toggleReviewLike(req.params.reviewId, req.user!.id));
  } catch (err) {
    next(err);
  }
}
