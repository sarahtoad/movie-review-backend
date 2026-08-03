"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMovie = postMovie;
exports.checkDuplicate = checkDuplicate;
exports.getMovie = getMovie;
exports.getMovies = getMovies;
exports.putMovie = putMovie;
exports.deleteMovieController = deleteMovieController;
const pagination_1 = require("../../utils/pagination");
const movie_service_1 = require("./movie.service");
async function postMovie(req, res, next) {
    try {
        res.status(201).json(await (0, movie_service_1.createMovie)(req.user.id, req.body));
    }
    catch (err) {
        next(err);
    }
}
async function checkDuplicate(req, res, next) {
    try {
        const title = typeof req.query.title === "string" ? req.query.title : "";
        const year = typeof req.query.year === "string"
            ? Number(req.query.year)
            : 0;
        if (!title || !year) {
            return res.status(400).json({
                error: "Title and year are required",
            });
        }
        const existing = await (0, movie_service_1.findExistingMovie)(title, year);
        res.json({
            exists: !!existing,
            movie: existing,
        });
    }
    catch (err) {
        next(err);
    }
}
async function getMovie(req, res, next) {
    try {
        const id = typeof req.params.id === "string"
            ? req.params.id
            : "";
        if (!id) {
            res.status(400).json({
                error: "Movie id is required",
            });
            return;
        }
        const movie = await (0, movie_service_1.getMovieById)(id, req.user?.id);
        res.json(movie);
    }
    catch (err) {
        next(err);
    }
}
async function getMovies(req, res, next) {
    try {
        const { skip, limit, page } = (0, pagination_1.parsePagination)(req.query);
        const { genre, sort } = req.query;
        const { movies, total } = await (0, movie_service_1.listMovies)({
            skip,
            limit,
            genre: genre ? String(genre) : undefined,
            sort: sort ? String(sort) : undefined,
        });
        res.json({ movies, total, page, limit });
    }
    catch (err) {
        next(err);
    }
}
async function putMovie(req, res, next) {
    try {
        const id = req.params.id; // Forçage du type
        const updated = await (0, movie_service_1.updateMovie)(id, req.user.id, req.body);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
}
async function deleteMovieController(req, res, next) {
    try {
        // 1. Extraction et extraction sécurisée sous forme de string
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        if (!id) {
            return res.status(400).json({ error: "L'ID du film est requis." });
        }
        const result = await (0, movie_service_1.deleteMovie)(id, req.user.id);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
