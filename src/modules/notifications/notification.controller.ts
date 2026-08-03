import { Request, Response, NextFunction } from 'express';
import { listNotifications, markAsRead, markAllAsRead, countUnread } from './notification.service';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await listNotifications(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ count: await countUnread(req.user!.id) });
  } catch (err) {
    next(err);
  }
}

export async function patchRead(req: Request, res: Response, next: NextFunction) {
  try {
    await markAsRead(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function patchReadAll(req: Request, res: Response, next: NextFunction) {
  try {
    await markAllAsRead(req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
