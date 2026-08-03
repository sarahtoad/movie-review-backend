import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";

import {
  postWatchlist,
  deleteWatchlist,
  listWatchlist,
} from "./watchlist.controller";

export const watchlistRoutes = Router();

watchlistRoutes.use(requireAuth);

watchlistRoutes.get("/", listWatchlist);

watchlistRoutes.post("/:movieId", postWatchlist);

watchlistRoutes.delete("/:movieId", deleteWatchlist);