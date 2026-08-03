"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genreRoutes = void 0;
const express_1 = require("express");
const genre_service_1 = require("./genre.service");
exports.genreRoutes = (0, express_1.Router)();
exports.genreRoutes.get('/', async (_req, res, next) => {
    try {
        res.json(await (0, genre_service_1.listGenres)());
    }
    catch (err) {
        next(err);
    }
});
