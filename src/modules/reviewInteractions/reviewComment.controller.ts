import { Request, Response, NextFunction } from "express";
import {
  addComment,
  editComment,
  removeComment,
} from "./reviewComment.service";

export async function postComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { content, parentId } = req.body;

    const reviewId = Array.isArray(req.params.reviewId)
      ? req.params.reviewId[0]
      : req.params.reviewId;

    res.status(201).json(
      await addComment(reviewId, req.user!.id, content, parentId)
    );
  } catch (err) {
    next(err);
  }
}

export async function patchComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    res.json(await editComment(id, req.user!.id, req.body.content));
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await removeComment(id, req.user!.id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}