import { QueryFilter, SortOrder, Types } from "mongoose";
import Transaction, { ITransaction } from "./transaction.model";
import { ApiError } from "../../utils/apiError";
import {
  CreateTransactionInput,
  ListTransactionsQuery,
  MonthlyTrendsQuery,
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

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = query.startDate;
    if (query.endDate) filter.date.$lte = query.endDate;
  }

  if (query.search) {
    const re = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: re }, { note: re }];
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
      .populate("categoryId", "name color type")
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
  const tx = await Transaction.findOne({ _id: id, userId })
    .populate("categoryId", "name color type")
    .exec();
  if (!tx) throw new ApiError(404, "Transaction not found");
  return tx;
};

export const createTransaction = async (
  userId: Types.ObjectId,
  input: CreateTransactionInput,
): Promise<ITransaction> => {
  const tx = await Transaction.create({
    userId,
    title: input.title,
    amount: input.amount,
    categoryId: input.categoryId ?? null,
    transactionType: input.transactionType,
    date: input.date ?? new Date(),
    note: input.note,
  });
  return tx.populate("categoryId", "name color type");
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
  )
    .populate("categoryId", "name color type")
    .exec();

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
  monthlyIncome: number;
  monthlyExpenses: number;
  totalBalance: number;
  savingRate: number;
}

interface TypeTotal {
  _id: "income" | "expense";
  total: number;
}

interface FacetResult {
  lifetime: TypeTotal[];
  monthly: TypeTotal[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const extractTotals = (
  groups: TypeTotal[],
): { income: number; expenses: number } => {
  let income = 0;
  let expenses = 0;
  for (const g of groups) {
    if (g._id === "income") income = round2(g.total);
    else if (g._id === "expense") expenses = round2(g.total);
  }
  return { income, expenses };
};

export const getFinancialSummary = async (
  userId: Types.ObjectId,
): Promise<FinancialSummary> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [result] = await Transaction.aggregate<FacetResult>([
    { $match: { userId } },
    {
      $facet: {
        lifetime: [
          { $group: { _id: "$transactionType", total: { $sum: "$amount" } } },
        ],
        monthly: [
          {
            $match: {
              date: { $gte: startOfMonth, $lt: startOfNextMonth },
            },
          },
          { $group: { _id: "$transactionType", total: { $sum: "$amount" } } },
        ],
      },
    },
  ]).exec();

  const lifetime = extractTotals(result?.lifetime ?? []);
  const monthly = extractTotals(result?.monthly ?? []);

  const totalBalance = round2(lifetime.income - lifetime.expenses);

  const savingRate =
    monthly.income > 0
      ? round2(((monthly.income - monthly.expenses) / monthly.income) * 100)
      : 0;

  return {
    monthlyIncome: monthly.income,
    monthlyExpenses: monthly.expenses,
    totalBalance,
    savingRate,
  };
};

export interface MonthlyTrendPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface ExpenseDistributionItem {
  category: string;
  color: string;
  amount: number;
}

interface MonthlyTrendGroup {
  _id: string;
  income: number;
  expenses: number;
}

const formatMonth = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const parseMonth = (month: string): Date => {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1);
};

const addMonths = (date: Date, n: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + n, 1);

export const getMonthlyTrends = async (
  userId: Types.ObjectId,
  _query: MonthlyTrendsQuery,
): Promise<MonthlyTrendPoint[]> => {
  const groups = await Transaction.aggregate<MonthlyTrendGroup>([
    { $match: { userId } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$date" },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0],
          },
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec();

  if (groups.length === 0) return [];

  const byMonth = new Map(
    groups.map((g) => [g._id, { income: g.income, expenses: g.expenses }]),
  );

  const first = parseMonth(groups[0]._id);
  const last = parseMonth(groups[groups.length - 1]._id);

  const result: MonthlyTrendPoint[] = [];
  let cursor = first;
  while (cursor <= last) {
    const key = formatMonth(cursor);
    const entry = byMonth.get(key) ?? { income: 0, expenses: 0 };
    result.push({ month: key, income: entry.income, expenses: entry.expenses });
    cursor = addMonths(cursor, 1);
  }

  return result;
};

export const getExpenseDistribution = async (
  userId: Types.ObjectId,
): Promise<ExpenseDistributionItem[]> => {
  const rows = await Transaction.aggregate<ExpenseDistributionItem>([
    {
      $match: {
        userId,
        transactionType: "expense",
        categoryId: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$categoryId",
        amount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "categories",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$categoryId"] },
                  { $eq: ["$userId", userId] },
                ],
              },
            },
          },
          { $project: { name: 1, color: 1 } },
        ],
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: 0,
        category: "$category.name",
        color: "$category.color",
        amount: 1,
      },
    },
    { $sort: { amount: -1 } },
  ]).exec();

  return rows.map((row) => ({
    ...row,
    amount: round2(row.amount),
  }));
};
