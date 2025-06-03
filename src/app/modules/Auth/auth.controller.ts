// import { Request, Response } from "express";
// import catchAsync from "../../../shared/catchAsync";
// import { AuthServices } from "./auth.service";
// import sendResponse from "../../../shared/sendResponse";
// import httpStatus from "http-status";

// const loginUser = catchAsync(async (req: Request, res: Response) => {
//     const result = await AuthServices.loginUser(req.body);

//     const { refreshToken } = result;

//     res.cookie('refreshToken', refreshToken, {
//         secure: false,
//         httpOnly: true
//     });

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Logged in successfully!",
//         data: {
//             accessToken: result.accessToken,
//             needPasswordChange: result.needPasswordChange
//         }
//     })
// });

// const refreshToken = catchAsync(async (req: Request, res: Response) => {
//     const { refreshToken } = req.cookies;

//     const result = await AuthServices.refreshToken(refreshToken);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Access token genereated successfully!",
//         data: result
//         // data: {
//         //     accessToken: result.accessToken,
//         //     needPasswordChange: result.needPasswordChange
//         // }
//     })
// });

// const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
//     const user = req.user;

//     const result = await AuthServices.changePassword(user, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Password Changed successfully",
//         data: result
//     })
// });

// const forgotPassword = catchAsync(async (req: Request, res: Response) => {

//     await AuthServices.forgotPassword(req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Check your email!",
//         data: null
//     })
// });

// const resetPassword = catchAsync(async (req: Request, res: Response) => {

//     const token = req.headers.authorization || "";

//     await AuthServices.resetPassword(token, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Password Reset!",
//         data: null
//     })
// });

// export const AuthController = {
//     loginUser,
//     refreshToken,
//     changePassword,
//     forgotPassword,
//     resetPassword
// };

// controllers/authController.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import config from "../../../config";
import { AuthServices } from "./auth.service";

// Register user
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);

  // Set refresh token as httpOnly cookie
  res.cookie("refreshToken", result.refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully!",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

// Login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  // Set refresh token as httpOnly cookie
  res.cookie("refreshToken", result.refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

// Refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed successfully!",
    data: result,
  });
});

// Change password
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully!",
      data: result,
    });
  }
);

// Forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent to email!",
    data: result,
  });
});

// Reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  const result = await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

// Get user profile
const getUserProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.userId;
    const result = await AuthServices.getUserProfile(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully!",
      data: result,
    });
  }
);

// Update user profile
const updateUserProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.userId;
    const result = await AuthServices.updateUserProfile(userId, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully!",
      data: result,
    });
  }
);

// Logout
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully!",
    data: null,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  logout,
};
