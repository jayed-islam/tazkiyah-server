import { UserRole } from "@prisma/client";

export type IAuthUser = {
  email: string;
  role: UserRole;
} | null;

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
