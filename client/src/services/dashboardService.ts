import api from "./api";

export interface DashboardSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalBalance: number;
  savingRate: number;
}

interface DashboardSummaryResponse {
  status: string;
  data: DashboardSummary;
}

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } =
    await api.get<DashboardSummaryResponse>("/dashboard/summary");
  return data.data;
};
