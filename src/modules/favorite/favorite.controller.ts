import { Request, Response, NextFunction } from "express";
import {
  createFavorite,
  deleteFavorite,
} from "./favorite.service";

export async function addFavorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = Array.isArray(req.params.movieId)
      ? req.params.movieId[0]
      : req.params.movieId;

    const favorite = await createFavorite(
      req.user!.id,
      movieId
    );

    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const movieId = Array.isArray(req.params.movieId)
      ? req.params.movieId[0]
      : req.params.movieId;

    await deleteFavorite(req.user!.id, movieId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}