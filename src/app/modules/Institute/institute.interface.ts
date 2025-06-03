export type IInstituteFilterRequest = {
  searchTerm?: string | undefined;
  name?: string | undefined;
  type?: string | undefined;
  gender?: string | undefined;
  companyId?: string | undefined;
};

export type IInstituteCreateRequest = {
  name: string;
  type: "SCHOOL" | "COLLEGE" | "UNIVERSITY" | "MADRASA" | "TRAINING_CENTER";
  gender: "MALE" | "FEMALE" | "MIXED";
  description?: string;
  address?: string;
  companyId: string;
};

export type IInstituteUpdateRequest = {
  name?: string;
  type?: "SCHOOL" | "COLLEGE" | "UNIVERSITY" | "MADRASA" | "TRAINING_CENTER";
  gender?: "MALE" | "FEMALE" | "MIXED";
  description?: string;
  address?: string;
  companyId?: string;
};

export type IInstituteStatistics = {
  totalCounts: {
    students: number;
    programs: number;
  };
  studentRoleDistribution: { [key: string]: number };
  studentGenderDistribution: { [key: string]: number };
  programStatusDistribution: { [key: string]: number };
  programCategoryDistribution: { [key: string]: number };
};
