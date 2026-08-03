"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReviewLike = postReviewLike;
const reviewLike_service_1 = require("./reviewLike.service");
async function postReviewLike(req, res, next) {
    try {
        const reviewId = Array.isArray(req.params.reviewId)
            ? req.params.reviewId[0]
            : req.params.reviewId;
        res.json(await (0, reviewLike_service_1.toggleReviewLike)(reviewId, req.user.id));
    }
    catch (err) {
        next(err);
    }
}
