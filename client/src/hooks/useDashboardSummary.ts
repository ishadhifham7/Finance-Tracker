import { useEffect, useState } from "react";
import {
  fetchDashboardSummary,
  type DashboardSummary,
} from "../services/dashboardService";

interface State {
  summary: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardSummary = () => {
  const [state, setState] = useState<State>({
    summary: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchDashboardSummary();
        if (!cancelled) {
          setState({ summary: data, isLoading: false, error: null });
        }
      } catch {
        if (!cancelled) {
          setState({
            summary: null,
            isLoading: false,
            error: "Failed to load summary.",
          });
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...state };
};
