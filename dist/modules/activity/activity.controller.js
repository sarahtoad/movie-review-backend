"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeed = getFeed;
exports.getMyActivity = getMyActivity;
const activity_service_1 = require("./activity.service");
/**
 * GET /api/activities/feed (ou /api/activities)
 * Récupère l'activité de toute la communauté.
 */
async function getFeed(_req, res, next) {
    try {
        const activities = await (0, activity_service_1.getGlobalActivity)();
        res.json(activities);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/activities/me
 * Récupère l'activité de l'utilisateur connecté.
 */
async function getMyActivity(req, res, next) {
    try {
        const activities = await (0, activity_service_1.getUserActivity)(req.user.id);
        res.json(activities);
    }
    catch (err) {
        next(err);
    }
}
