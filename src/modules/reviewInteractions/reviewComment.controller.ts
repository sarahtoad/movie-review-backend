import { Request, Response, NextFunction } from 'express';
import { addComment, editComment, removeComment } from './reviewComment.service';

export async function postComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content, parentId } = req.body;
    res.status(201).json(await addComment(req.params.reviewId, req.user!.id, content, parentId));
  } catch (err) {
    next(err);
  }
}

export async function patchComment(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await editComment(req.params.id, req.user!.id, req.body.content));
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    await removeComment(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
