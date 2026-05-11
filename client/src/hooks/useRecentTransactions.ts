import { useEffect, useState } from "react";
import type { Transaction } from "../components/transactions/types";
import { fetchTransactions } from "../services/transactionService";

interface State {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export const useRecentTransactions = () => {
  const [state, setState] = useState<State>({
    transactions: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchTransactions({
          limit: 4,
          sort: "newest",
          page: 1,
        });
        if (!cancelled) {
          setState({ transactions: data.items, isLoading: false, error: null });
        }
      } catch {
        if (!cancelled) {
          setState({
            transactions: [],
            isLoading: false,
            error: "Failed to load transactions.",
          });
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
