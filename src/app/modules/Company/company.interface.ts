export type ICompanyFilterRequest = {
  searchTerm?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  isActive?: string | undefined;
};

export type ICompanyCreateRequest = {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
};

export type ICompanyUpdateRequest = {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
};

export type ICompanyStatistics = {
  totalCounts: {
    employees: number;
    institutes: number;
    programs: number;
    tasks: number;
  };
  roleDistribution: { [key: string]: number };
  taskStatusDistribution: { [key: string]: number };
  taskPriorityDistribution: { [key: string]: number };
  programStatusDistribution: { [key: string]: number };
};

export enum CompanyStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
  CLOSED = "closed",
}
