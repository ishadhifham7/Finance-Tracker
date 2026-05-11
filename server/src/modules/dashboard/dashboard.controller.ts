import type { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { AuthRequest } from "../auth/auth.types";
import * as txService from "../transactions/transaction.service";

const requireUserId = (req: AuthRequest): Types.ObjectId => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  return req.user._id as Types.ObjectId;
};

export const getDashboardSummary = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const summary = await txService.getFinancialSummary(userId);

    res.status(200).json({
      status: "success",
      data: summary,
    });
  },
);
