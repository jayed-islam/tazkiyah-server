import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { InstituteServices } from "./institute.service";
import { instituteFilterableFields } from "./institute.constants";

// Create institute
const createInstitute = catchAsync(async (req: Request, res: Response) => {
  const result = await InstituteServices.createInstitute(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Institute created successfully!",
    data: result,
  });
});

// Get all institutes
const getAllInstitutes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, instituteFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await InstituteServices.getAllInstitutes(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Institutes retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get single institute
const getSingleInstitute = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InstituteServices.getSingleInstitute(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Institute retrieved successfully!",
    data: result,
  });
});

// Get institutes by company
const getInstitutesByCompany = catchAsync(
  async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const result = await InstituteServices.getInstitutesByCompany(companyId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Company institutes retrieved successfully!",
      data: result,
    });
  }
);

// Update institute
const updateInstitute = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InstituteServices.updateInstitute(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Institute updated successfully!",
    data: result,
  });
});

// Delete institute
const deleteInstitute = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InstituteServices.deleteInstitute(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Institute deleted successfully!",
    data: result,
  });
});

// Get institute statistics
const getInstituteStatistics = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await InstituteServices.getInstituteStatistics(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Institute statistics retrieved successfully!",
      data: result,
    });
  }
);

export const InstituteController = {
  createInstitute,
  getAllInstitutes,
  getSingleInstitute,
  getInstitutesByCompany,
  updateInstitute,
  deleteInstitute,
  getInstituteStatistics,
};
