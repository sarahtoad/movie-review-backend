"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postComment = postComment;
exports.patchComment = patchComment;
exports.deleteComment = deleteComment;
const reviewComment_service_1 = require("./reviewComment.service");
async function postComment(req, res, next) {
    try {
        const { content, parentId } = req.body;
        const reviewId = Array.isArray(req.params.reviewId)
            ? req.params.reviewId[0]
            : req.params.reviewId;
        res.status(201).json(await (0, reviewComment_service_1.addComment)(reviewId, req.user.id, content, parentId));
    }
    catch (err) {
        next(err);
    }
}
async function patchComment(req, res, next) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        res.json(await (0, reviewComment_service_1.editComment)(id, req.user.id, req.body.content));
    }
    catch (err) {
        next(err);
    }
}
async function deleteComment(req, res, next) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        await (0, reviewComment_service_1.removeComment)(id, req.user.id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
