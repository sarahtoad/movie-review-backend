import { Request, Response, NextFunction } from "express";
import { getGlobalActivity, getUserActivity } from "./activity.service";

/**
 * GET /api/activities/feed (ou /api/activities)
 * Récupère l'activité de toute la communauté.
 */
export async function getFeed(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const activities = await getGlobalActivity();
    res.json(activities);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/activities/me
 * Récupère l'activité de l'utilisateur connecté.
 */
export async function getMyActivity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const activities = await getUserActivity(req.user!.id);
    res.json(activities);
  } catch (err) {
    next(err);
  }
}