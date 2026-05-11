import { Types } from "mongoose";
import Budget from "./budget.model";
import Category from "../categories/category.model";
import { ApiError } from "../../utils/apiError";
import type { CreateBudgetInput, UpdateBudgetInput } from "./budget.validation";

export interface BudgetAnalytics {
  id: Types.ObjectId;
  category: {
    id: Types.ObjectId | null;
    name: string | null;
    color: string | null;
  };
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  exceeded: boolean;
  period: "monthly";
}

const buildBudgetPipeline = (userId: Types.ObjectId, budgetId?: string) => {
  const match: Record<string, unknown> = { userId };
  if (budgetId) match._id = new Types.ObjectId(budgetId);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return [
    { $match: match },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "transactions",
        let: { userId: "$userId", categoryId: "$categoryId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$userId"] },
                  { $eq: ["$categoryId", "$$categoryId"] },
                  { $eq: ["$transactionType", "expense"] },
                  { $gte: ["$date", startOfMonth] },
                  { $lt: ["$date", startOfNextMonth] },
                ],
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ],
        as: "monthlySpend",
      },
    },
    {
      $addFields: {
        spentAmount: {
          $ifNull: [{ $arrayElemAt: ["$monthlySpend.total", 0] }, 0],
        },
      },
    },
    {
      $addFields: {
        remainingAmount: { $subtract: ["$amount", "$spentAmount"] },
        progressPercentage: {
          $cond: [
            { $gt: ["$amount", 0] },
            {
              $round: [
                { $multiply: [{ $divide: ["$spentAmount", "$amount"] }, 100] },
                0,
              ],
            },
            0,
          ],
        },
        exceeded: { $gt: ["$spentAmount", "$amount"] },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        budgetAmount: "$amount",
        period: 1,
        spentAmount: 1,
        remainingAmount: 1,
        progressPercentage: 1,
        exceeded: 1,
        category: {
          id: "$category._id",
          name: "$category.name",
          color: "$category.color",
        },
      },
    },
  ];
};

export const listBudgets = async (
  userId: Types.ObjectId,
): Promise<BudgetAnalytics[]> => {
  return Budget.aggregate<BudgetAnalytics>(buildBudgetPipeline(userId)).exec();
};

export const getBudgetById = async (
  userId: Types.ObjectId,
  id: string,
): Promise<BudgetAnalytics> => {
  const [budget] = await Budget.aggregate<BudgetAnalytics>(
    buildBudgetPipeline(userId, id),
  ).exec();

  if (!budget) throw new ApiError(404, "Budget not found");
  return budget;
};

export const createBudget = async (
  userId: Types.ObjectId,
  input: CreateBudgetInput,
): Promise<BudgetAnalytics> => {
  const category = await Category.findOne({
    _id: input.categoryId,
    userId,
  }).exec();

  if (!category) throw new ApiError(404, "Category not found");
  if (category.type === "income") {
    throw new ApiError(400, "Budget category must be expense or both");
  }

  const existing = await Budget.findOne({
    userId,
    categoryId: input.categoryId,
  }).exec();
  if (existing)
    throw new ApiError(409, "Budget already exists for this category");

  const created = await Budget.create({
    userId,
    categoryId: input.categoryId,
    amount: input.amount,
    period: input.period ?? "monthly",
  });

  return getBudgetById(userId, created._id.toString());
};

export const updateBudget = async (
  userId: Types.ObjectId,
  id: string,
  input: UpdateBudgetInput,
): Promise<BudgetAnalytics> => {
  const updated = await Budget.findOneAndUpdate(
    { _id: id, userId },
    { $set: input },
    { new: true, runValidators: true, context: "query" },
  ).exec();

  if (!updated) throw new ApiError(404, "Budget not found");
  return getBudgetById(userId, id);
};

export const deleteBudget = async (
  userId: Types.ObjectId,
  id: string,
): Promise<void> => {
  const result = await Budget.findOneAndDelete({ _id: id, userId })
    .lean()
    .exec();
  if (!result) throw new ApiError(404, "Budget not found");
};
