import { Request, Response, NextFunction } from "express";
import { toggleWatchlist, listWatchlist } from "./watchlist.service";

export async function postWatchlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = Array.isArray(req.params.movieId)
      ? req.params.movieId[0]
      : req.params.movieId;

    res.json(await toggleWatchlist(req.user!.id, movieId));
  } catch (err) {
    next(err);
  }
}

export async function getWatchlist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.json(await listWatchlist(req.user!.id));
  } catch (err) {
    next(err);
  }
}