import { Institute } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { paginationHelper } from "../../../helpars/paginationHelper";

// Create institute
const createInstitute = async (payload: any): Promise<Institute> => {
  // Check if company exists
  const company = await prisma.company.findUnique({
    where: {
      id: payload.companyId,
      isActive: true,
    },
  });

  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "Company not found!");
  }

  const result = await prisma.institute.create({
    data: {
      name: payload.name,
      type: payload.type,
      gender: payload.gender,
      description: payload.description,
      address: payload.address,
      companyId: payload.companyId,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
          //   status: true,
        },
      },
      _count: {
        select: {
          students: true,
          programs: true,
        },
      },
    },
  });

  return result;
};

// Get all institutes
const getAllInstitutes = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Institute[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, type, gender, companyId, ...filterData } = filters;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (type) {
    andConditions.push({
      type: type,
    });
  }

  if (gender) {
    andConditions.push({
      gender: gender,
    });
  }

  if (companyId) {
    andConditions.push({
      companyId: companyId,
    });
  }

  // Handle other filter data
  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).forEach((key) => {
      andConditions.push({
        [key]: {
          equals: (filterData as any)[key],
        },
      });
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.institute.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
          //   status: true,
        },
      },
      _count: {
        select: {
          students: true,
          programs: true,
        },
      },
    },
  });

  const total = await prisma.institute.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// Get single institute
const getSingleInstitute = async (id: string): Promise<Institute | null> => {
  const result = await prisma.institute.findUnique({
    where: {
      id,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phone: true,
          email: true,
        },
      },
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          phone: true,
          profileImage: true,
          dateOfBirth: true,
          createdAt: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
          description: true,
          //   status: true,
          startDate: true,
          endDate: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          students: true,
          programs: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Institute not found!");
  }

  return result;
};

const getInstitutesByCompany = async (
  companyId: string
): Promise<Institute[]> => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
      isActive: true,
    },
  });

  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "Company not found!");
  }

  const result = await prisma.institute.findMany({
    where: {
      companyId,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
        },
      },
      _count: {
        select: {
          students: true,
          programs: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Update institute
const updateInstitute = async (
  id: string,
  payload: Partial<Institute>
): Promise<Institute> => {
  const institute = await prisma.institute.findUnique({
    where: {
      id,
    },
  });

  if (!institute) {
    throw new ApiError(httpStatus.NOT_FOUND, "Institute not found!");
  }

  // If companyId is being updated, check if new company exists
  if (payload.companyId && payload.companyId !== institute.companyId) {
    const company = await prisma.company.findUnique({
      where: {
        id: payload.companyId,
        isActive: true,
      },
    });

    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, "Company not found!");
    }
  }

  const result = await prisma.institute.update({
    where: {
      id,
    },
    data: {
      name: payload.name || institute.name,
      type: payload.type || institute.type,
      gender: payload.gender || institute.gender,
      description: payload.description || institute.description,
      address: payload.address || institute.address,
      companyId: payload.companyId || institute.companyId,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
        },
      },
      _count: {
        select: {
          students: true,
          programs: true,
        },
      },
    },
  });

  return result;
};

// Delete institute
const deleteInstitute = async (id: string): Promise<Institute> => {
  const institute = await prisma.institute.findUnique({
    where: {
      id,
    },
  });

  if (!institute) {
    throw new ApiError(httpStatus.NOT_FOUND, "Institute not found!");
  }

  // Check if institute has active students or programs
  const hasActiveRelations = await prisma.institute.findFirst({
    where: {
      id,
      OR: [
        { students: { some: { isActive: true } } },
        { programs: { some: {} } },
      ],
    },
  });

  if (hasActiveRelations) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete institute with active students or programs!"
    );
  }

  const result = await prisma.institute.delete({
    where: {
      id,
    },
  });

  return result;
};

// Get institute statistics
const getInstituteStatistics = async (id: string) => {
  const institute = await prisma.institute.findUnique({
    where: {
      id,
    },
  });

  if (!institute) {
    throw new ApiError(httpStatus.NOT_FOUND, "Institute not found!");
  }

  const stats = await prisma.institute.findUnique({
    where: { id },
    select: {
      _count: {
        select: {
          students: true,
          programs: true,
        },
      },
      students: {
        where: { isActive: true },
        select: {
          role: true,
          gender: true,
        },
      },
      programs: {
        select: {
          status: true,
          category: true,
        },
      },
    },
  });

  // Calculate student role distribution
  const studentRoleDistribution = stats?.students.reduce(
    (acc: any, student) => {
      acc[student.role] = (acc[student.role] || 0) + 1;
      return acc;
    },
    {}
  );

  // Calculate student gender distribution
  const studentGenderDistribution = stats?.students.reduce(
    (acc: any, student) => {
      acc[student.gender] = (acc[student.gender] || 0) + 1;
      return acc;
    },
    {}
  );

  // Calculate program status distribution
  const programStatusDistribution = stats?.programs.reduce(
    (acc: any, program) => {
      acc[program.status] = (acc[program.status] || 0) + 1;
      return acc;
    },
    {}
  );

  // Calculate program category distribution
  const programCategoryDistribution = stats?.programs.reduce(
    (acc: any, program) => {
      acc[program.category] = (acc[program.category] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalCounts: stats?._count,
    studentRoleDistribution,
    studentGenderDistribution,
    programStatusDistribution,
    programCategoryDistribution,
  };
};

export const InstituteServices = {
  createInstitute,
  getAllInstitutes,
  getSingleInstitute,
  getInstitutesByCompany,
  updateInstitute,
  deleteInstitute,
  getInstituteStatistics,
};
