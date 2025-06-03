import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

// Public routes
router.post(
  "/register",
  validateRequest(AuthValidation.registerUser),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginUser),
  AuthController.loginUser
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPassword),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPassword),
  AuthController.resetPassword
);

// Protected routes
router.post(
  "/change-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AuthValidation.changePassword),
  AuthController.changePassword
);

router.get(
  "/profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AuthController.getUserProfile
);

router.patch(
  "/profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AuthValidation.updateProfile),
  AuthController.updateUserProfile
);

router.post(
  "/logout",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AuthController.logout
);

export const AuthRoutes = router;
