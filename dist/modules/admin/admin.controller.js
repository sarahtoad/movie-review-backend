"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.removeUser = removeUser;
exports.removeReview = removeReview;
exports.removeComment = removeComment;
exports.patchMovie = patchMovie;
const admin_service_1 = require("./admin.service");
async function getUsers(_req, res, next) {
    try {
        res.json(await (0, admin_service_1.listAllUsers)());
    }
    catch (err) {
        next(err);
    }
}
async function removeUser(req, res, next) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        await (0, admin_service_1.deleteUserAccount)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function removeReview(req, res, next) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        await (0, admin_service_1.deleteReviewContent)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function removeComment(req, res, next) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        await (0, admin_service_1.deleteCommentContent)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function patchMovie(req, res, next) {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        res.json(await (0, admin_service_1.updateMovieInfo)(id, req.body));
    }
    catch (err) {
        next(err);
    }
}
