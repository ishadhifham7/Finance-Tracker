import { useCallback, useEffect, useState } from "react";
import { type BudgetAnalytics, fetchBudgets } from "../services/budgetService";

interface State {
  budgets: BudgetAnalytics[];
  isLoading: boolean;
  error: string | null;
}

export const useBudgets = () => {
  const [state, setState] = useState<State>({
    budgets: [],
    isLoading: true,
    error: null,
  });

  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchBudgets();
        if (!cancelled) {
          setState({ budgets: data, isLoading: false, error: null });
        }
      } catch {
        if (!cancelled) {
          setState({
            budgets: [],
            isLoading: false,
            error: "Failed to load budgets.",
          });
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [refreshTick]);

  const refresh = useCallback(() => setRefreshTick((n) => n + 1), []);

  return { ...state, refresh };
};
