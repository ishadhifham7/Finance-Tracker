import type { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { AuthRequest } from "../auth/auth.types";
import * as budgetService from "./budget.service";
import {
  createBudgetSchema,
  updateBudgetSchema,
  budgetIdParamsSchema,
} from "./budget.validation";

const requireUserId = (req: AuthRequest): Types.ObjectId => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  return req.user._id as Types.ObjectId;
};

export const createBudget = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const input = createBudgetSchema.parse(req.body);
    const budget = await budgetService.createBudget(userId, input);

    res.status(201).json({
      status: "success",
      data: { budget },
    });
  },
);

export const listBudgets = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const budgets = await budgetService.listBudgets(userId);

    res.status(200).json({
      status: "success",
      data: { budgets },
    });
  },
);

export const getBudget = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = budgetIdParamsSchema.parse(req.params);
    const budget = await budgetService.getBudgetById(userId, id);

    res.status(200).json({
      status: "success",
      data: { budget },
    });
  },
);

export const updateBudget = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = budgetIdParamsSchema.parse(req.params);
    const input = updateBudgetSchema.parse(req.body);
    const budget = await budgetService.updateBudget(userId, id, input);

    res.status(200).json({
      status: "success",
      data: { budget },
    });
  },
);

export const deleteBudget = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = budgetIdParamsSchema.parse(req.params);
    await budgetService.deleteBudget(userId, id);

    res.status(200).json({
      status: "success",
      data: { id },
    });
  },
);
