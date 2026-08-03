import { Request, Response, NextFunction } from "express";
import {
  createReview,
  listReviewsForMovie,
  updateReview,
  deleteReview,
} from "./review.service";

function getParam(param: string | string[] | undefined): string | undefined {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

export async function postReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = getParam(req.params.movieId) ?? getParam(req.body.movieId);

    if (!movieId) {
      return res.status(400).json({
        error: "Movie ID is required",
      });
    }

    const review = await createReview(req.user!.id, {
      ...req.body,
      movieId,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getMovieReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = getParam(req.params.movieId) ?? getParam(req.body.movieId);

    if (!movieId) {
      return res.status(400).json({
        error: "Movie ID is required",
      });
    }

    const reviews = await listReviewsForMovie(movieId);

    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function patchReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviewId = getParam(req.params.id);

    if (!reviewId) {
      return res.status(400).json({
        error: "Review ID is required",
      });
    }

    const review = await updateReview(
      reviewId,
      req.user!.id,
      req.body
    );

    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function removeReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviewId = getParam(req.params.id);

    if (!reviewId) {
      return res.status(400).json({
        error: "Review ID is required",
      });
    }

    await deleteReview(reviewId, req.user!.id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}