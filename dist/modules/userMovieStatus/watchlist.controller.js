"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postWatchlist = postWatchlist;
exports.getWatchlist = getWatchlist;
const watchlist_service_1 = require("./watchlist.service");
async function postWatchlist(req, res, next) {
    try {
        const movieId = Array.isArray(req.params.movieId)
            ? req.params.movieId[0]
            : req.params.movieId;
        res.json(await (0, watchlist_service_1.toggleWatchlist)(req.user.id, movieId));
    }
    catch (err) {
        next(err);
    }
}
async function getWatchlist(req, res, next) {
    try {
        res.json(await (0, watchlist_service_1.listWatchlist)(req.user.id));
    }
    catch (err) {
        next(err);
    }
}
