import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { postFavorite, getFavorites } from './favorite.controller';
import { postWatchlist, getWatchlist } from './watchlist.controller';

export const statusRoutes = Router();

statusRoutes.post('/favorites/:movieId', requireAuth, postFavorite);
statusRoutes.get('/favorites', requireAuth, getFavorites);
statusRoutes.post('/watchlist/:movieId', requireAuth, postWatchlist);
statusRoutes.get('/watchlist', requireAuth, getWatchlist);
