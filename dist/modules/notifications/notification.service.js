"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.listNotifications = listNotifications;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.countUnread = countUnread;
const prismaClient_1 = require("../../config/prismaClient");
async function createNotification(input) {
    if (input.recipientId === input.actorId)
        return null;
    return prismaClient_1.prisma.notification.create({ data: input });
}
async function listNotifications(userId) {
    return prismaClient_1.prisma.notification.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            actor: { select: { id: true, username: true, name: true, avatar: true } },
            movie: { select: { id: true, title: true } },
        },
    });
}
async function markAsRead(notificationId, userId) {
    return prismaClient_1.prisma.notification.updateMany({
        where: { id: notificationId, recipientId: userId },
        data: { read: true },
    });
}
async function markAllAsRead(userId) {
    return prismaClient_1.prisma.notification.updateMany({ where: { recipientId: userId, read: false }, data: { read: true } });
}
async function countUnread(userId) {
    return prismaClient_1.prisma.notification.count({ where: { recipientId: userId, read: false } });
}
