import { Request, Response, NextFunction } from "express";
import { toggleFavorite, listFavorites } from "./favorite.service";

export async function postFavorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = Array.isArray(req.params.movieId)
      ? req.params.movieId[0]
      : req.params.movieId;

    res.json(await toggleFavorite(req.user!.id, movieId));
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.json(await listFavorites(req.user!.id));
  } catch (err) {
    next(err);
  }
}