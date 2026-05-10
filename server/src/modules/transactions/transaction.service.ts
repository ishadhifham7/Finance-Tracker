import { QueryFilter, SortOrder, Types } from "mongoose";
import Transaction, { ITransaction } from "./transaction.model";
import { ApiError } from "../../utils/apiError";
import {
  CreateTransactionInput,
  ListTransactionsQuery,
  SummaryQuery,
  UpdateTransactionInput,
} from "./transaction.validation";

type SortOption = ListTransactionsQuery["sort"];

const SORT_MAP: Record<SortOption, Record<string, SortOrder>> = {
  newest: { date: -1, _id: -1 },
  oldest: { date: 1, _id: 1 },
  highest: { amount: -1, _id: -1 },
  lowest: { amount: 1, _id: 1 },
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildListFilter = (
  userId: Types.ObjectId,
  query: ListTransactionsQuery,
): QueryFilter<ITransaction> => {
  const filter: QueryFilter<ITransaction> = { userId };

  if (query.type) filter.transactionType = query.type;
  if (query.category) filter.category = query.category;

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = query.startDate;
    if (query.endDate) filter.date.$lte = query.endDate;
  }

  if (query.search) {
    const re = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: re }, { note: re }, { category: re }];
  }

  return filter;
};

export interface ListTransactionsResult {
  items: ITransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const listTransactions = async (
  userId: Types.ObjectId,
  query: ListTransactionsQuery,
): Promise<ListTransactionsResult> => {
  const filter = buildListFilter(userId, query);
  const sort = SORT_MAP[query.sort];
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(query.limit)
      .lean<ITransaction[]>()
      .exec(),
    Transaction.countDocuments(filter).exec(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    },
  };
};

export const getTransactionById = async (
  userId: Types.ObjectId,
  id: string,
): Promise<ITransaction> => {
  const tx = await Transaction.findOne({ _id: id, userId }).exec();
  if (!tx) throw new ApiError(404, "Transaction not found");
  return tx;
};

export const createTransaction = async (
  userId: Types.ObjectId,
  input: CreateTransactionInput,
): Promise<ITransaction> => {
  return Transaction.create({
    userId,
    title: input.title,
    amount: input.amount,
    category: input.category,
    transactionType: input.transactionType,
    date: input.date ?? new Date(),
    note: input.note,
  });
};

export const updateTransaction = async (
  userId: Types.ObjectId,
  id: string,
  input: UpdateTransactionInput,
): Promise<ITransaction> => {
  const tx = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    { $set: input },
    { new: true, runValidators: true, context: "query" },
  ).exec();

  if (!tx) throw new ApiError(404, "Transaction not found");
  return tx;
};

export const deleteTransaction = async (
  userId: Types.ObjectId,
  id: string,
): Promise<void> => {
  const result = await Transaction.findOneAndDelete({ _id: id, userId })
    .lean()
    .exec();
  if (!result) throw new ApiError(404, "Transaction not found");
};

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

interface SummaryGroup {
  _id: "income" | "expense";
  total: number;
  count: number;
}

export const getFinancialSummary = async (
  userId: Types.ObjectId,
  query: SummaryQuery,
): Promise<FinancialSummary> => {
  const match: QueryFilter<ITransaction> = { userId };
  if (query.startDate || query.endDate) {
    match.date = {};
    if (query.startDate) match.date.$gte = query.startDate;
    if (query.endDate) match.date.$lte = query.endDate;
  }

  const groups = await Transaction.aggregate<SummaryGroup>([
    { $match: match },
    {
      $group: {
        _id: "$transactionType",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]).exec();

  const summary: FinancialSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0,
  };

  for (const g of groups) {
    if (g._id === "income") {
      summary.totalIncome = Math.round(g.total * 100) / 100;
      summary.incomeCount = g.count;
    } else if (g._id === "expense") {
      summary.totalExpenses = Math.round(g.total * 100) / 100;
      summary.expenseCount = g.count;
    }
  }

  summary.balance =
    Math.round((summary.totalIncome - summary.totalExpenses) * 100) / 100;
  summary.transactionCount = summary.incomeCount + summary.expenseCount;

  return summary;
};
