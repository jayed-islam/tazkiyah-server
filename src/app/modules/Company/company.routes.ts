import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CompanyController } from "./company.controller";
import { CompanyValidation } from "./company.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// // Get company statistics
// router.get(
//   "/statistics/:id",
//   auth(
//     UserRole.SUPER_ADMIN,
//     UserRole.ADMIN,
//     UserRole.MANAGER
//   ),
//   CompanyController.getCompanyStatistics
// );

// Create company
router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(CompanyValidation.createCompanyZodSchema),
  CompanyController.createCompany
);

// Get all companies
router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  CompanyController.getAllCompanies
);

// Get single company
router.get(
  "/:id",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.EMPLOYEE
  ),
  CompanyController.getSingleCompany
);

// Update company
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(CompanyValidation.updateCompanyZodSchema),
  CompanyController.updateCompany
);

// Delete company
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  CompanyController.deleteCompany
);

export const CompanyRoutes = router;
