// import { UserStatus } from "@prisma/client";
// import { jwtHelpers } from "../../../helpars/jwtHelpers";
// import prisma from "../../../shared/prisma";
// import * as bcrypt from 'bcrypt'
// import config from "../../../config";
// import { Secret } from "jsonwebtoken";
// import emailSender from "./emailSender";
// import ApiError from "../../errors/ApiError";
// import httpStatus from "http-status";

// const loginUser = async (payload: {
//     email: string,
//     password: string
// }) => {
//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: payload.email,
//             status: UserStatus.ACTIVE
//         }
//     });

//     const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

//     if (!isCorrectPassword) {
//         throw new Error("Password incorrect!")
//     }
//     const accessToken = jwtHelpers.generateToken({
//         email: userData.email,
//         role: userData.role
//     },
//         config.jwt.jwt_secret as Secret,
//         config.jwt.expires_in as string
//     );

//     const refreshToken = jwtHelpers.generateToken({
//         email: userData.email,
//         role: userData.role
//     },
//         config.jwt.refresh_token_secret as Secret,
//         config.jwt.refresh_token_expires_in as string
//     );

//     return {
//         accessToken,
//         refreshToken,
//         needPasswordChange: userData.needPasswordChange
//     };
// };

// const refreshToken = async (token: string) => {
//     let decodedData;
//     try {
//         decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
//     }
//     catch (err) {
//         throw new Error("You are not authorized!")
//     }

//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: decodedData.email,
//             status: UserStatus.ACTIVE
//         }
//     });

//     const accessToken = jwtHelpers.generateToken({
//         email: userData.email,
//         role: userData.role
//     },
//         config.jwt.jwt_secret as Secret,
//         config.jwt.expires_in as string
//     );

//     return {
//         accessToken,
//         needPasswordChange: userData.needPasswordChange
//     };

// };

// const changePassword = async (user: any, payload: any) => {
//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: user.email,
//             status: UserStatus.ACTIVE
//         }
//     });

//     const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

//     if (!isCorrectPassword) {
//         throw new Error("Password incorrect!")
//     }

//     const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

//     await prisma.user.update({
//         where: {
//             email: userData.email
//         },
//         data: {
//             password: hashedPassword,
//             needPasswordChange: false
//         }
//     })

//     return {
//         message: "Password changed successfully!"
//     }
// };

// const forgotPassword = async (payload: { email: string }) => {
//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: payload.email,
//             status: UserStatus.ACTIVE
//         }
//     });

//     const resetPassToken = jwtHelpers.generateToken(
//         { email: userData.email, role: userData.role },
//         config.jwt.reset_pass_secret as Secret,
//         config.jwt.reset_pass_token_expires_in as string
//     )
//     //console.log(resetPassToken)

//     const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

//     await emailSender(
//         userData.email,
//         `
//         <div>
//             <p>Dear User,</p>
//             <p>Your password reset link
//                 <a href=${resetPassLink}>
//                     <button>
//                         Reset Password
//                     </button>
//                 </a>
//             </p>

//         </div>
//         `
//     )
//     //console.log(resetPassLink)
// };

// const resetPassword = async (token: string, payload: { id: string, password: string }) => {
//     console.log({ token, payload })

//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             id: payload.id,
//             status: UserStatus.ACTIVE
//         }
//     });

//     const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret)

//     if (!isValidToken) {
//         throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
//     }

//     // hash password
//     const password = await bcrypt.hash(payload.password, 12);

//     // update into database
//     await prisma.user.update({
//         where: {
//             id: payload.id
//         },
//         data: {
//             password
//         }
//     })
// };

// export const AuthServices = {
//     loginUser,
//     refreshToken,
//     changePassword,
//     forgotPassword,
//     resetPassword
// }

import { Gender, UserRole, UserType } from "@prisma/client";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../../helpars/jwtHelpers";

// Types for the auth service
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterUserPayload {
  email: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender: Gender;
  role: UserRole;
  userType: UserType;
  companyId?: string;
  instituteId?: string;
  islamicProfile?: {
    islamicName?: string;
    prayerTimings?: any;
    islamicGoals?: string[];
    favoriteSupplications?: string[];
  };
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface ResetPasswordPayload {
  id: string;
  password: string;
}

// Register a new user
const registerUser = async (payload: RegisterUserPayload) => {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: payload.email }, { phone: payload.phone }],
    },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email or phone!"
    );
  }

  // Validate company/institute existence
  if (payload.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: payload.companyId },
    });
    if (!company) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid company ID!");
    }
  }

  if (payload.instituteId) {
    const institute = await prisma.institute.findUnique({
      where: { id: payload.instituteId },
    });
    if (!institute) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid institute ID!");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Create user with Islamic profile in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const newUser = await tx.user.create({
      data: {
        email: payload.email,
        phone: payload.phone,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
        role: payload.role,
        userType: payload.userType,
        companyId: payload.companyId,
        instituteId: payload.instituteId,
        isActive: true,
      },
    });

    // Create Islamic profile
    await tx.islamicProfile.create({
      data: {
        userId: newUser.id,
        islamicName: payload.islamicProfile?.islamicName,
        prayerTimings: payload.islamicProfile?.prayerTimings,
        islamicGoals: payload.islamicProfile?.islamicGoals || [],
        favoriteSupplications:
          payload.islamicProfile?.favoriteSupplications || [],
        behaviorScore: 0,
        selfDevelopmentScore: 0,
        amalScore: 0,
        overallRating: 0.0,
        totalAmalCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
    });

    return newUser;
  });

  // Generate tokens
  const accessToken = jwtHelpers.generateToken(
    {
      userId: result.id,
      email: result.email,
      role: result.role,
      userType: result.userType,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      userId: result.id,
      email: result.email,
      role: result.role,
      userType: result.userType,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  // Return user data (excluding password)
  const { password: _, ...userWithoutPassword } = result;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

// Login user
const loginUser = async (payload: LoginPayload) => {
  // Find user with Islamic profile
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      isActive: true,
    },
    include: {
      islamicProfile: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      institute: {
        select: {
          id: true,
          name: true,
          type: true,
          gender: true,
        },
      },
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found or inactive!");
  }

  // Check password
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password incorrect!");
  }

  // Generate tokens
  const accessToken = jwtHelpers.generateToken(
    {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      userType: userData.userType,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      userType: userData.userType,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  // Remove password from response
  const { password: _, ...userWithoutPassword } = userData;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

// Refresh token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
      isActive: true,
    },
    include: {
      islamicProfile: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      userType: userData.userType,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

// Change password
const changePassword = async (user: any, payload: ChangePasswordPayload) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
      isActive: true,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect!"
    );
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

// Forgot password
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      isActive: true,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with this email!");
  }

  const resetPassToken = jwtHelpers.generateToken(
    {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c5530;">Password Reset Request</h2>
            <p>Assalamu Alaikum ${userData.firstName},</p>
            <p>You have requested to reset your password for your Islamic Organization account.</p>
            <p>Please click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetPassLink}" style="background-color: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p>This link will expire in 10 minutes for security reasons.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>JazakAllahu Khairan,<br>Islamic Organization Team</p>
        </div>
        `
  );

  return {
    message: "Password reset link sent to your email!",
  };
};

// Reset password
const resetPassword = async (token: string, payload: ResetPasswordPayload) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: payload.id,
      isActive: true,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  try {
    const isValidToken = jwtHelpers.verifyToken(
      token,
      config.jwt.reset_pass_secret as Secret
    );

    // Verify token belongs to this user
    if (isValidToken.userId !== payload.id) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid token!");
    }
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid or expired token!");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Update password in database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password reset successfully!",
  };
};

// Get user profile
const getUserProfile = async (userId: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
      isActive: true,
    },
    include: {
      islamicProfile: true,
      company: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      institute: {
        select: {
          id: true,
          name: true,
          type: true,
          gender: true,
          description: true,
        },
      },
      achievements: {
        take: 5,
        orderBy: {
          achievedDate: "desc",
        },
      },
      taskAssignments: {
        where: {
          status: "PENDING",
        },
        take: 5,
        include: {
          task: {
            select: {
              id: true,
              title: true,
              category: true,
              priority: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = userData;

  return userWithoutPassword;
};

// Update user profile
const updateUserProfile = async (userId: string, payload: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
      isActive: true,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Update user and Islamic profile in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update user basic info
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        firstName: payload.firstName || userData.firstName,
        lastName: payload.lastName || userData.lastName,
        phone: payload.phone || userData.phone,
        profileImage: payload.profileImage || userData.profileImage,
        dateOfBirth: payload.dateOfBirth || userData.dateOfBirth,
      },
    });

    // Update Islamic profile if provided
    if (payload.islamicProfile) {
      await tx.islamicProfile.update({
        where: { userId },
        data: {
          islamicName: payload.islamicProfile.islamicName,
          prayerTimings: payload.islamicProfile.prayerTimings,
          islamicGoals: payload.islamicProfile.islamicGoals,
          favoriteSupplications: payload.islamicProfile.favoriteSupplications,
        },
      });
    }

    return updatedUser;
  });

  return {
    message: "Profile updated successfully!",
    user: result,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
};
