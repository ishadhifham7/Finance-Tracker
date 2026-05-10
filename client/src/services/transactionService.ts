import api from "./api";
import type { Transaction } from "../components/transactions/types";

export interface FetchTransactionsParams {
  search?: string;
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
  sort?: "newest" | "oldest" | "highest" | "lowest";
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

export type UpdateTransactionPayload = Partial<
  Pick<
    Transaction,
    "title" | "amount" | "category" | "transactionType" | "date" | "note"
  >
>;

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
