"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const activity_controller_1 = require("./activity.controller");
exports.activityRoutes = (0, express_1.Router)();
// Modifiez '/feed' par '/'
exports.activityRoutes.get('/', activity_controller_1.getFeed);
exports.activityRoutes.get('/me', auth_middleware_1.requireAuth, activity_controller_1.getMyActivity);
