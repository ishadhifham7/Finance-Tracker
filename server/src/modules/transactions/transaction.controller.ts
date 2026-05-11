import type { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { AuthRequest } from "../auth/auth.types";
import * as txService from "./transaction.service";
import {
  createTransactionSchema,
  expenseDistributionQuerySchema,
  listTransactionsQuerySchema,
  monthlyTrendsQuerySchema,
  transactionIdParamsSchema,
  updateTransactionSchema,
} from "./transaction.validation";

const requireUserId = (req: AuthRequest): Types.ObjectId => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  return req.user._id as Types.ObjectId;
};

export const createTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const input = createTransactionSchema.parse(req.body);
    const tx = await txService.createTransaction(userId, input);

    res.status(201).json({
      status: "success",
      data: { transaction: tx },
    });
  },
);

export const listTransactions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const query = listTransactionsQuerySchema.parse(req.query);
    const result = await txService.listTransactions(userId, query);

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const getFinancialSummary = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const summary = await txService.getFinancialSummary(userId);

    res.status(200).json({
      status: "success",
      data: summary,
    });
  },
);

export const getMonthlyTrends = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const query = monthlyTrendsQuerySchema.parse(req.query);
    const data = await txService.getMonthlyTrends(userId, query);

    res.status(200).json({
      status: "success",
      data,
    });
  },
);

export const getExpenseDistribution = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    expenseDistributionQuerySchema.parse(req.query);
    const data = await txService.getExpenseDistribution(userId);

    res.status(200).json({
      status: "success",
      data,
    });
  },
);

export const getTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = transactionIdParamsSchema.parse(req.params);
    const tx = await txService.getTransactionById(userId, id);

    res.status(200).json({
      status: "success",
      data: { transaction: tx },
    });
  },
);

export const updateTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = transactionIdParamsSchema.parse(req.params);
    const input = updateTransactionSchema.parse(req.body);
    const tx = await txService.updateTransaction(userId, id, input);

    res.status(200).json({
      status: "success",
      data: { transaction: tx },
    });
  },
);

export const deleteTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req);
    const { id } = transactionIdParamsSchema.parse(req.params);
    await txService.deleteTransaction(userId, id);

    res.status(200).json({
      status: "success",
      data: { id },
    });
  },
);
