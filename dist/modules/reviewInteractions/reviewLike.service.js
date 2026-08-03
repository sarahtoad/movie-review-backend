"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleReviewLike = toggleReviewLike;
const prismaClient_1 = require("../../config/prismaClient");
const apiError_1 = require("../../utils/apiError");
const notification_service_1 = require("../notifications/notification.service");
async function toggleReviewLike(reviewId, userId) {
    const review = await prismaClient_1.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review)
        throw apiError_1.ApiError.notFound('Avis introuvable');
    const existing = await prismaClient_1.prisma.reviewLike.findUnique({ where: { userId_reviewId: { userId, reviewId } } });
    if (existing) {
        await prismaClient_1.prisma.reviewLike.delete({ where: { id: existing.id } });
        return { liked: false };
    }
    await prismaClient_1.prisma.reviewLike.create({ data: { userId, reviewId } });
    if (review.userId !== userId) {
        await (0, notification_service_1.createNotification)({
            recipientId: review.userId,
            actorId: userId,
            type: 'LIKE',
            message: 'a aimé votre avis.',
            reviewId,
        });
    }
    return { liked: true };
}
