import { Request, Response, NextFunction } from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "./watchlist.service";

export async function postWatchlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = Array.isArray(req.params.movieId)
      ? req.params.movieId[0]
      : req.params.movieId;

    res.status(201).json(
      await addToWatchlist(req.user!.id, movieId)
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteWatchlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = Array.isArray(req.params.movieId)
      ? req.params.movieId[0]
      : req.params.movieId;

    await removeFromWatchlist(req.user!.id, movieId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function listWatchlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.json(await getWatchlist(req.user!.id));
  } catch (err) {
    next(err);
  }
}