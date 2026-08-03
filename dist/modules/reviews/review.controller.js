"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReview = postReview;
exports.getMovieReviews = getMovieReviews;
exports.patchReview = patchReview;
exports.removeReview = removeReview;
const review_service_1 = require("./review.service");
function getParam(param) {
    if (!param)
        return undefined;
    return Array.isArray(param) ? param[0] : param;
}
async function postReview(req, res, next) {
    try {
        const movieId = getParam(req.params.movieId) ?? getParam(req.body.movieId);
        if (!movieId) {
            return res.status(400).json({
                error: "Movie ID is required",
            });
        }
        const review = await (0, review_service_1.createReview)(req.user.id, {
            ...req.body,
            movieId,
        });
        res.status(201).json(review);
    }
    catch (err) {
        next(err);
    }
}
async function getMovieReviews(req, res, next) {
    try {
        const movieId = getParam(req.params.movieId) ?? getParam(req.body.movieId);
        if (!movieId) {
            return res.status(400).json({
                error: "Movie ID is required",
            });
        }
        const reviews = await (0, review_service_1.listReviewsForMovie)(movieId);
        res.json(reviews);
    }
    catch (err) {
        next(err);
    }
}
async function patchReview(req, res, next) {
    try {
        const reviewId = getParam(req.params.id);
        if (!reviewId) {
            return res.status(400).json({
                error: "Review ID is required",
            });
        }
        const review = await (0, review_service_1.updateReview)(reviewId, req.user.id, req.body);
        res.json(review);
    }
    catch (err) {
        next(err);
    }
}
async function removeReview(req, res, next) {
    try {
        const reviewId = getParam(req.params.id);
        if (!reviewId) {
            return res.status(400).json({
                error: "Review ID is required",
            });
        }
        await (0, review_service_1.deleteReview)(reviewId, req.user.id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
