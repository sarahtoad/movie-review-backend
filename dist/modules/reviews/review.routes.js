"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const review_schema_1 = require("./review.schema");
const review_controller_1 = require("./review.controller");
// mergeParams: true ensures :movieId passes down from app.use('/api/movies/:movieId/reviews')
exports.reviewRoutes = (0, express_1.Router)({ mergeParams: true });
// Matches GET /api/movies/:movieId/reviews  AND  GET /api/reviews/movie/:movieId
exports.reviewRoutes.get('/', review_controller_1.getMovieReviews);
exports.reviewRoutes.get('/movie/:movieId', review_controller_1.getMovieReviews);
// Matches POST /api/movies/:movieId/reviews  AND  POST /api/reviews
exports.reviewRoutes.post('/', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(review_schema_1.createReviewSchema), review_controller_1.postReview);
// Matches PATCH /api/reviews/:id  AND  DELETE /api/reviews/:id
exports.reviewRoutes.patch('/:id', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(review_schema_1.updateReviewSchema), review_controller_1.patchReview);
exports.reviewRoutes.delete('/:id', auth_middleware_1.requireAuth, review_controller_1.removeReview);
