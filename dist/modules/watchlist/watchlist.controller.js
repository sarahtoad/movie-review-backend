"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postWatchlist = postWatchlist;
exports.deleteWatchlist = deleteWatchlist;
exports.listWatchlist = listWatchlist;
const watchlist_service_1 = require("./watchlist.service");
async function postWatchlist(req, res, next) {
    try {
        const movieId = Array.isArray(req.params.movieId)
            ? req.params.movieId[0]
            : req.params.movieId;
        res.status(201).json(await (0, watchlist_service_1.addToWatchlist)(req.user.id, movieId));
    }
    catch (err) {
        next(err);
    }
}
async function deleteWatchlist(req, res, next) {
    try {
        const movieId = Array.isArray(req.params.movieId)
            ? req.params.movieId[0]
            : req.params.movieId;
        await (0, watchlist_service_1.removeFromWatchlist)(req.user.id, movieId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function listWatchlist(req, res, next) {
    try {
        res.json(await (0, watchlist_service_1.getWatchlist)(req.user.id));
    }
    catch (err) {
        next(err);
    }
}
