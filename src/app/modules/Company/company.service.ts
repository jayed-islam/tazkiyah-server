import { Company } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IGenericResponse } from "../../interfaces/common";

// Create company
const createCompany = async (payload: any): Promise<Company> => {
  const result = await prisma.company.create({
    data: {
      name: payload.name,
      description: payload.description,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
      isActive: payload.isActive ?? true,
    },
    include: {
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      institutes: {
        select: {
          id: true,
          name: true,
          type: true,
          gender: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
      _count: {
        select: {
          employees: true,
          institutes: true,
          programs: true,
          tasks: true,
        },
      },
    },
  });

  return result;
};

// Get all companies
const getAllCompanies = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Company[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, isActive, ...filterData } = filters;

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
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (isActive !== undefined) {
    andConditions.push({
      isActive: isActive === "true",
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

  const result = await prisma.company.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      institutes: {
        select: {
          id: true,
          name: true,
          type: true,
          gender: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
      _count: {
        select: {
          employees: true,
          institutes: true,
          programs: true,
          tasks: true,
        },
      },
    },
  });

  const total = await prisma.company.count({
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
// Get single company
const getSingleCompany = async (id: string): Promise<Company | null> => {
  const result = await prisma.company.findUnique({
    where: {
      id,
      isActive: true,
    },
    include: {
      employees: {
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
      institutes: {
        select: {
          id: true,
          name: true,
          type: true,
          gender: true,
          description: true,
          address: true,
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
          createdAt: true,
        },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          category: true,
          priority: true,
          type: true,
          //   status: true,
          createdAt: true,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          employees: true,
          institutes: true,
          programs: true,
          tasks: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Company not found!");
  }

  return result;
};

// Update company
const updateCompany = async (
  id: string,
  payload: Partial<Company>
): Promise<Company> => {
  const company = await prisma.company.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "Company not found!");
  }

  const result = await prisma.company.update({
    where: {
      id,
    },
    data: {
      name: payload.name || company.name,
      description: payload.description || company.description,
      address: payload.address || company.address,
      phone: payload.phone || company.phone,
      email: payload.email || company.email,
      isActive: payload.isActive ?? company.isActive,
    },
    include: {
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      institutes: {
        select: {
          id: true,
          name: true,
          type: true,
          gender: true,
        },
      },
      programs: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
      _count: {
        select: {
          employees: true,
          institutes: true,
          programs: true,
          tasks: true,
        },
      },
    },
  });

  return result;
};

// Delete company (soft delete)
const deleteCompany = async (id: string): Promise<Company> => {
  const company = await prisma.company.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "Company not found!");
  }

  // Check if company has active employees, institutes, or programs
  const hasActiveRelations = await prisma.company.findFirst({
    where: {
      id,
      OR: [
        { employees: { some: { isActive: true } } },
        { institutes: { some: {} } },
        { programs: { some: {} } },
      ],
    },
  });

  if (hasActiveRelations) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete company with active employees, institutes, or programs!"
    );
  }

  const result = await prisma.company.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return result;
};

// // Get company statistics
// const getCompanyStatistics = async (id: string) => {
//   const company = await prisma.company.findUnique({
//     where: {
//       id,
//       isActive: true,
//     },
//   });

//   if (!company) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Company not found!");
//   }

//   const stats = await prisma.company.findUnique({
//     where: { id },
//     select: {
//       _count: {
//         select: {
//           employees: true,
//           institutes: true,
//           programs: true,
//           tasks: true,
//         },
//       },
//       employees: {
//         where: { isActive: true },
//         select: {
//           role: true,
//         },
//       },
//       tasks: {
//         select: {
//           //   status: true,
//           priority: true,
//         },
//       },
//       programs: {
//         select: {
//           //   status: true,
//           category: true,
//         },
//       },
//     },
//   });

//   // Calculate role distribution
//   const roleDistribution = stats?.employees.reduce((acc: any, emp) => {
//     acc[emp.role] = (acc[emp.role] || 0) + 1;
//     return acc;
//   }, {});

//   // Calculate task status distribution
//   const taskStatusDistribution = stats?.tasks.reduce((acc: any, task) => {
//     acc[task.status] = (acc[task.status] || 0) + 1;
//     return acc;
//   }, {});

//   // Calculate task priority distribution
//   const taskPriorityDistribution = stats?.tasks.reduce((acc: any, task) => {
//     acc[task.priority] = (acc[task.priority] || 0) + 1;
//     return acc;
//   }, {});

//   // Calculate program status distribution
//   const programStatusDistribution = stats?.programs.reduce(
//     (acc: any, program) => {
//       acc[program.status] = (acc[program.status] || 0) + 1;
//       return acc;
//     },
//     {}
//   );

//   return {
//     totalCounts: stats?._count,
//     roleDistribution,
//     taskStatusDistribution,
//     taskPriorityDistribution,
//     programStatusDistribution,
//   };
// };

export const CompanyServices = {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
  //   getCompanyStatistics,
};
