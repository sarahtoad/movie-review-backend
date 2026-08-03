"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.listReviewsForMovie = listReviewsForMovie;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
const prismaClient_1 = require("../../config/prismaClient");
async function createReview(userId, data) {
    return prismaClient_1.prisma.review.create({
        data: {
            userId,
            movieId: data.movieId,
            rating: Number(data.rating),
            content: data.content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
}
async function listReviewsForMovie(movieId) {
    return prismaClient_1.prisma.review.findMany({
        where: { movieId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
// Add these functions to your review.service.ts file
async function updateReview(reviewId, userId, data) {
    // Option 1: Ensure the user updating the review is the owner
    const review = await prismaClient_1.prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    if (review.userId !== userId) {
        throw new Error("Unauthorized to edit this review");
    }
    return prismaClient_1.prisma.review.update({
        where: { id: reviewId },
        data: {
            ...(data.rating !== undefined && { rating: Number(data.rating) }),
            ...(data.content !== undefined && { content: data.content }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
}
async function deleteReview(reviewId, userId) {
    // Option 1: Verify ownership before deletion
    const review = await prismaClient_1.prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    if (review.userId !== userId) {
        throw new Error("Unauthorized to delete this review");
    }
    return prismaClient_1.prisma.review.delete({
        where: { id: reviewId },
    });
}
