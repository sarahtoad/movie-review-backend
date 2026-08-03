import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  addFavorite,
  removeFavorite,
} from "./favorite.controller";

export const favoriteRoutes = Router();

favoriteRoutes.use(requireAuth);

favoriteRoutes.post("/:movieId", addFavorite);
favoriteRoutes.delete("/:movieId", removeFavorite);