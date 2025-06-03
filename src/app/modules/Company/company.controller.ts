import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { CompanyServices } from "./company.service";
import { companyFilterableFields } from "./company.constants";

// Create company
const createCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.createCompany(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Company created successfully!",
    data: result,
  });
});

// Get all companies
const getAllCompanies = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, companyFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await CompanyServices.getAllCompanies(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Companies retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get single company
const getSingleCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyServices.getSingleCompany(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company retrieved successfully!",
    data: result,
  });
});

// Update company
const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyServices.updateCompany(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company updated successfully!",
    data: result,
  });
});

// Delete company
const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyServices.deleteCompany(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Company deleted successfully!",
    data: result,
  });
});

// // Get company statistics
// const getCompanyStatistics = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await CompanyServices.getCompanyStatistics(id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Company statistics retrieved successfully!",
//     data: result,
//   });
// });

export const CompanyController = {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
  //   getCompanyStatistics,
};
