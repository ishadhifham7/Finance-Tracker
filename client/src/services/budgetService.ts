import api from "./api";

export interface BudgetAnalytics {
  id: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  exceeded: boolean;
  period: "monthly";
}

interface ListBudgetsResponse {
  status: string;
  data: {
    budgets: BudgetAnalytics[];
  };
}

export interface CreateBudgetPayload {
  categoryId: string;
  amount: number;
  period: "monthly";
}

export interface UpdateBudgetPayload {
  amount?: number;
  period?: "monthly";
}

export const fetchBudgets = async (): Promise<BudgetAnalytics[]> => {
  const { data } = await api.get<ListBudgetsResponse>("/budgets");
  return data.data.budgets;
};

export const createBudget = async (
  payload: CreateBudgetPayload,
): Promise<BudgetAnalytics> => {
  const { data } = await api.post<{
    status: string;
    data: { budget: BudgetAnalytics };
  }>("/budgets", payload);
  return data.data.budget;
};

export const updateBudget = async (
  id: string,
  payload: UpdateBudgetPayload,
): Promise<BudgetAnalytics> => {
  const { data } = await api.patch<{
    status: string;
    data: { budget: BudgetAnalytics };
  }>(`/budgets/${id}`, payload);
  return data.data.budget;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await api.delete(`/budgets/${id}`);
};
