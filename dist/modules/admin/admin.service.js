"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = deleteUserAccount;
exports.deleteReviewContent = deleteReviewContent;
exports.deleteCommentContent = deleteCommentContent;
exports.updateMovieInfo = updateMovieInfo;
exports.listAllUsers = listAllUsers;
const prismaClient_1 = require("../../config/prismaClient");
async function deleteUserAccount(userId) {
    return prismaClient_1.prisma.user.delete({ where: { id: userId } });
}
async function deleteReviewContent(reviewId) {
    return prismaClient_1.prisma.review.delete({ where: { id: reviewId } });
}
async function deleteCommentContent(commentId) {
    return prismaClient_1.prisma.reviewComment.delete({ where: { id: commentId } });
}
async function updateMovieInfo(movieId, data) {
    return prismaClient_1.prisma.movie.update({ where: { id: movieId }, data });
}
async function listAllUsers() {
    return prismaClient_1.prisma.user.findMany({
        select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    });
}
