"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = addComment;
exports.editComment = editComment;
exports.removeComment = removeComment;
const prismaClient_1 = require("../../config/prismaClient");
const apiError_1 = require("../../utils/apiError");
const notification_service_1 = require("../notifications/notification.service");
async function addComment(reviewId, userId, content, parentId) {
    const review = await prismaClient_1.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review)
        throw apiError_1.ApiError.notFound('Avis introuvable');
    let recipientId = review.userId;
    if (parentId) {
        const parent = await prismaClient_1.prisma.reviewComment.findUnique({ where: { id: parentId } });
        if (!parent || parent.reviewId !== reviewId)
            throw apiError_1.ApiError.badRequest('Commentaire parent invalide');
        recipientId = parent.userId;
    }
    const comment = await prismaClient_1.prisma.reviewComment.create({
        data: { reviewId, userId, content, parentId },
        include: { user: { select: { id: true, username: true, name: true, avatar: true } } },
    });
    if (recipientId !== userId) {
        await (0, notification_service_1.createNotification)({
            recipientId,
            actorId: userId,
            type: 'COMMENT',
            message: parentId ? 'a répondu à votre commentaire.' : 'a commenté votre avis.',
            reviewId,
        });
    }
    return comment;
}
async function assertCommentOwner(commentId, userId) {
    const comment = await prismaClient_1.prisma.reviewComment.findUnique({ where: { id: commentId } });
    if (!comment)
        throw apiError_1.ApiError.notFound('Commentaire introuvable');
    if (comment.userId !== userId)
        throw apiError_1.ApiError.forbidden('Vous ne pouvez modifier que vos propres commentaires.');
    return comment;
}
async function editComment(commentId, userId, content) {
    await assertCommentOwner(commentId, userId);
    return prismaClient_1.prisma.reviewComment.update({ where: { id: commentId }, data: { content } });
}
async function removeComment(commentId, userId) {
    await assertCommentOwner(commentId, userId);
    await prismaClient_1.prisma.reviewComment.delete({ where: { id: commentId } });
}
