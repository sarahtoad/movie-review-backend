import { Request, Response, NextFunction } from 'express';
import {
  deleteUserAccount,
  deleteReviewContent,
  deleteCommentContent,
  updateMovieInfo,
  listAllUsers,
} from './admin.service';

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await listAllUsers());
  } catch (err) {
    next(err);
  }
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUserAccount(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function removeReview(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteReviewContent(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteCommentContent(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function patchMovie(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await updateMovieInfo(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}
