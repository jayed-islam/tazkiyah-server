import { z } from "zod";
import { Gender, UserRole, UserType } from "@prisma/client";

const registerUser = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),

    phone: z.string().optional(),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),

    firstName: z
      .string({
        required_error: "First name is required",
      })
      .min(1, "First name cannot be empty"),

    lastName: z
      .string({
        required_error: "Last name is required",
      })
      .min(1, "Last name cannot be empty"),

    dateOfBirth: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),

    gender: z.nativeEnum(Gender, {
      required_error: "Gender is required",
    }),

    role: z.nativeEnum(UserRole, {
      required_error: "Role is required",
    }),

    userType: z.nativeEnum(UserType, {
      required_error: "User type is required",
    }),

    companyId: z.string().optional(),
    instituteId: z.string().optional(),

    islamicProfile: z
      .object({
        islamicName: z.string().optional(),
        prayerTimings: z.any().optional(),
        islamicGoals: z.array(z.string()).optional(),
        favoriteSupplications: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),

    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Current password is required",
    }),

    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
  }),
});

const resetPassword = z.object({
  body: z.object({
    id: z.string({
      required_error: "User ID is required",
    }),

    password: z
      .string({
        required_error: "New password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

const updateProfile = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    profileImage: z.string().optional(),
    dateOfBirth: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),

    islamicProfile: z
      .object({
        islamicName: z.string().optional(),
        prayerTimings: z.any().optional(),
        islamicGoals: z.array(z.string()).optional(),
        favoriteSupplications: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

export const AuthValidation = {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
};
