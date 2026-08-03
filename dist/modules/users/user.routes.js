"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const user_schema_1 = require("./user.schema");
const user_controller_1 = require("./user.controller");
exports.userRoutes = (0, express_1.Router)();
// Utilisateur connecté
exports.userRoutes.get("/me", auth_middleware_1.requireAuth, user_controller_1.getCurrentUser);
// Profil public
exports.userRoutes.get("/:username", user_controller_1.getProfile);
// Modifier son profil
exports.userRoutes.patch("/me", auth_middleware_1.requireAuth, upload_middleware_1.uploadUserImages, (0, validate_middleware_1.validate)(user_schema_1.updateProfileSchema), user_controller_1.patchProfile);
