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
    const favorite = await createFavorite(
      req.user!.id,
      req.params.movieId
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
    await deleteFavorite(req.user!.id, req.params.movieId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}