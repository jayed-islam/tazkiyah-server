import { z } from "zod";

const createInstituteZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Institute name is required",
      })
      .min(2, "Institute name must be at least 2 characters")
      .max(100, "Institute name must not exceed 100 characters"),
    type: z.enum(
      ["SCHOOL", "COLLEGE", "UNIVERSITY", "MADRASA", "TRAINING_CENTER"],
      {
        required_error: "Institute type is required",
        invalid_type_error: "Invalid institute type",
      }
    ),
    gender: z.enum(["MALE", "FEMALE", "MIXED"], {
      required_error: "Gender specification is required",
      invalid_type_error: "Invalid gender specification",
    }),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
    address: z
      .string()
      .max(200, "Address must not exceed 200 characters")
      .optional(),
    companyId: z
      .string({
        required_error: "Company ID is required",
      })
      .min(1, "Company ID is required"),
  }),
});

const updateInstituteZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Institute name must be at least 2 characters")
      .max(100, "Institute name must not exceed 100 characters")
      .optional(),
    type: z
      .enum(["SCHOOL", "COLLEGE", "UNIVERSITY", "MADRASA", "TRAINING_CENTER"], {
        invalid_type_error: "Invalid institute type",
      })
      .optional(),
    gender: z
      .enum(["MALE", "FEMALE", "MIXED"], {
        invalid_type_error: "Invalid gender specification",
      })
      .optional(),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
    address: z
      .string()
      .max(200, "Address must not exceed 200 characters")
      .optional(),
    companyId: z.string().min(1, "Company ID is required").optional(),
  }),
});

export const InstituteValidation = {
  createInstituteZodSchema,
  updateInstituteZodSchema,
};
