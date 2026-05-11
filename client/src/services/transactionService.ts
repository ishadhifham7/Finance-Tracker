import api from "./api";
import type { Transaction } from "../components/transactions/types";

export interface FetchTransactionsParams {
  search?: string;
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
  sort?: "newest" | "oldest" | "highest" | "lowest";
  limit?: number;
  page?: number;
}

interface ListTransactionsResponse {
  status: string;
  data: {
    items: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

interface SingleTransactionResponse {
  status: string;
  data: { transaction: Transaction };
}

export type UpdateTransactionPayload = {
  title?: string;
  amount?: number;
  categoryId?: string | null;
  transactionType?: Transaction["transactionType"];
  date?: string;
  note?: string;
};

export type CreateTransactionPayload = {
  title: string;
  amount: number;
  categoryId?: string | null;
  transactionType: Transaction["transactionType"];
  date?: string;
  note?: string;
};

export const fetchTransactions = async (
  params: FetchTransactionsParams = {},
): Promise<ListTransactionsResponse["data"]> => {
  const { data } = await api.get<ListTransactionsResponse>("/transactions", {
    params,
  });
  return data.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const updateTransaction = async (
  id: string,
  payload: UpdateTransactionPayload,
): Promise<Transaction> => {
  const { data } = await api.patch<SingleTransactionResponse>(
    `/transactions/${id}`,
    payload,
  );
  return data.data.transaction;
};

export const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const { data } = await api.post<SingleTransactionResponse>(
    "/transactions",
    payload,
  );
  return data.data.transaction;
};

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}

export interface ExpenseDistributionItem {
  category: string;
  color: string;
  amount: number;
}

export const fetchMonthlyTrends = async (): Promise<MonthlyTrend[]> => {
  const { data } = await api.get<{ status: string; data: MonthlyTrend[] }>(
    "/transactions/monthly-trends",
  );
  return data.data;
};

export const fetchExpenseDistribution = async (): Promise<
  ExpenseDistributionItem[]
> => {
  const { data } = await api.get<{
    status: string;
    data: ExpenseDistributionItem[];
  }>("/transactions/expense-distribution");
  return data.data;
};
