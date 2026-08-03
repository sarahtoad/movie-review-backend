"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
const favorite_service_1 = require("./favorite.service");
async function addFavorite(req, res, next) {
    try {
        const movieId = Array.isArray(req.params.movieId)
            ? req.params.movieId[0]
            : req.params.movieId;
        const favorite = await (0, favorite_service_1.createFavorite)(req.user.id, movieId);
        res.status(201).json(favorite);
    }
    catch (err) {
        next(err);
    }
}
async function removeFavorite(req, res, next) {
    try {
        const movieId = Array.isArray(req.params.movieId)
            ? req.params.movieId[0]
            : req.params.movieId;
        await (0, favorite_service_1.deleteFavorite)(req.user.id, movieId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
