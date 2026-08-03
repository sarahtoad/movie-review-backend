"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendingRoutes = void 0;
const express_1 = require("express");
const trending_service_1 = require("./trending.service");
exports.trendingRoutes = (0, express_1.Router)();
exports.trendingRoutes.get('/', async (_req, res, next) => {
    try {
        res.json(await (0, trending_service_1.getTrending)());
    }
    catch (err) {
        next(err);
    }
});
