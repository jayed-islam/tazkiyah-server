import { z } from "zod";

const createCompanyZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Company name is required",
      })
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must not exceed 100 characters"),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
    address: z
      .string()
      .max(200, "Address must not exceed 200 characters")
      .optional(),
    phone: z
      .string()
      .regex(/^[+]?[0-9\s\-\(\)]{7,20}$/, "Invalid phone number format")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateCompanyZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must not exceed 100 characters")
      .optional(),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
    address: z
      .string()
      .max(200, "Address must not exceed 200 characters")
      .optional(),
    phone: z
      .string()
      .regex(/^[+]?[0-9\s\-\(\)]{7,20}$/, "Invalid phone number format")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    isActive: z.boolean().optional(),
  }),
});

export const CompanyValidation = {
  createCompanyZodSchema,
  updateCompanyZodSchema,
};
