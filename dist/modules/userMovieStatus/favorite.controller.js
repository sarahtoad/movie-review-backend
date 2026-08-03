"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postFavorite = postFavorite;
exports.getFavorites = getFavorites;
const favorite_service_1 = require("./favorite.service");
async function postFavorite(req, res, next) {
    try {
        const movieId = Array.isArray(req.params.movieId)
            ? req.params.movieId[0]
            : req.params.movieId;
        res.json(await (0, favorite_service_1.toggleFavorite)(req.user.id, movieId));
    }
    catch (err) {
        next(err);
    }
}
async function getFavorites(req, res, next) {
    try {
        res.json(await (0, favorite_service_1.listFavorites)(req.user.id));
    }
    catch (err) {
        next(err);
    }
}
