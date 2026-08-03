import { Router } from "express";
import { uploadUserImages } from "../../middlewares/upload.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./user.schema";
import {
  getCurrentUser,
  getProfile,
  patchProfile,
} from "./user.controller";

export const userRoutes = Router();

// Utilisateur connecté
userRoutes.get("/me", requireAuth, getCurrentUser);

// Profil public
userRoutes.get("/:username", getProfile);

// Modifier son profil
userRoutes.patch(
  "/me",
  requireAuth,
  uploadUserImages,
  validate(updateProfileSchema),
  patchProfile
);