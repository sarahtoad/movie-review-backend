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
    const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

await deleteUserAccount(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function removeReview(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

    await deleteReviewContent(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

    await deleteCommentContent(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function patchMovie(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

res.json(await updateMovieInfo(id, req.body));
  } catch (err) {
    next(err);
  }
}
