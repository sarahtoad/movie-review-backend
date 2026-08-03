import { Request, Response, NextFunction } from 'express';
import { toggleWatchlist, listWatchlist } from './watchlist.service';

export async function postWatchlist(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await toggleWatchlist(req.user!.id, req.params.movieId));
  } catch (err) {
    next(err);
  }
}

export async function getWatchlist(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await listWatchlist(req.user!.id));
  } catch (err) {
    next(err);
  }
}
