import { useState, useEffect } from "react";
import {
  fetchMonthlyTrends,
  type MonthlyTrend,
} from "../services/transactionService";

export function useMonthlyTrends() {
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTrends = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMonthlyTrends();
        if (isMounted) {
          setTrends(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch trends",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTrends();

    return () => {
      isMounted = false;
    };
  }, []);

  return { trends, isLoading, error };
}
