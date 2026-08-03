"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoutes = void 0;
const express_1 = require("express");
const search_service_1 = require("./search.service");
exports.searchRoutes = (0, express_1.Router)();
exports.searchRoutes.get('/', async (req, res, next) => {
    try {
        res.json(await (0, search_service_1.globalSearch)(String(req.query.q ?? '')));
    }
    catch (err) {
        next(err);
    }
});
