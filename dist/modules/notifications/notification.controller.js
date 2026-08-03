"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.getUnreadCount = getUnreadCount;
exports.patchRead = patchRead;
exports.patchReadAll = patchReadAll;
const notification_service_1 = require("./notification.service");
async function getNotifications(req, res, next) {
    try {
        res.json(await (0, notification_service_1.listNotifications)(req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function getUnreadCount(req, res, next) {
    try {
        res.json({ count: await (0, notification_service_1.countUnread)(req.user.id) });
    }
    catch (err) {
        next(err);
    }
}
async function patchRead(req, res, next) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        await (0, notification_service_1.markAsRead)(id, req.user.id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function patchReadAll(req, res, next) {
    try {
        await (0, notification_service_1.markAllAsRead)(req.user.id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
