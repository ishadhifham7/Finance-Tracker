import type { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { AuthRequest } from "./auth.types";

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

export const syncUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    res.status(200).json({
      status: "success",
      data: { user: req.user },
    });
  },
);
