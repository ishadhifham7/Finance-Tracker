import { useState, useEffect } from "react";
import {
  fetchExpenseDistribution,
  type ExpenseDistributionItem,
} from "../services/transactionService";

export function useExpenseDistribution() {
  const [distribution, setDistribution] = useState<ExpenseDistributionItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDistribution = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchExpenseDistribution();
        if (isMounted) {
          setDistribution(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch expense distribution",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDistribution();

    return () => {
      isMounted = false;
    };
  }, []);

  return { distribution, isLoading, error };
}
