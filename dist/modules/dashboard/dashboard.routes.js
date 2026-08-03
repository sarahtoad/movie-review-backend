"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const dashboard_service_1 = require("./dashboard.service");
exports.dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes.get('/', auth_middleware_1.requireAuth, async (req, res, next) => {
    try {
        res.json(await (0, dashboard_service_1.getDashboard)(req.user.id));
    }
    catch (err) {
        next(err);
    }
});
