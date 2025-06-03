import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { InstituteController } from "./institute.controller";
import { UserRole } from "@prisma/client";
import { InstituteValidation } from "./institute.validation";

const router = express.Router();

// Get institute statistics
router.get(
  "/statistics/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER),
  InstituteController.getInstituteStatistics
);

// Get institutes by company
router.get(
  "/company/:companyId",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  InstituteController.getInstitutesByCompany
);

// Create institute
router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(InstituteValidation.createInstituteZodSchema),
  InstituteController.createInstitute
);

// Get all institutes
router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  InstituteController.getAllInstitutes
);

// Get single institute
router.get(
  "/:id",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  InstituteController.getSingleInstitute
);

// Update institute
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(InstituteValidation.updateInstituteZodSchema),
  InstituteController.updateInstitute
);

// Delete institute
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  InstituteController.deleteInstitute
);

export const InstituteRoutes = router;
