import { Request, Response, NextFunction } from "express";
import { toggleReviewLike } from "./reviewLike.service";

export async function postReviewLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviewId = Array.isArray(req.params.reviewId)
      ? req.params.reviewId[0]
      : req.params.reviewId;

    res.json(await toggleReviewLike(reviewId, req.user!.id));
  } catch (err) {
    next(err);
  }
}