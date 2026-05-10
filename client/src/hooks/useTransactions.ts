import { useCallback, useEffect, useState } from "react";
import type { Transaction, TransactionFilters } from "../components/transactions/types";
import { fetchTransactions } from "../services/transactionService";

interface State {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export const useTransactions = (filters: TransactionFilters) => {
  const [state, setState] = useState<State>({
    transactions: [],
    isLoading: true,
    error: null,
  });

  // Debounce only the search field — all other filters trigger immediately
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Counter bump lets callers force a re-fetch (e.g. after failed optimistic delete)
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchTransactions({
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(filters.type ? { type: filters.type } : {}),
          ...(filters.startDate ? { startDate: filters.startDate } : {}),
          ...(filters.endDate ? { endDate: filters.endDate } : {}),
          sort: filters.sort,
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
  }, [
    debouncedSearch,
    filters.type,
    filters.startDate,
    filters.endDate,
    filters.sort,
    refreshTick,
  ]);

  const removeTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const replaceTransaction = useCallback((updated: Transaction) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === updated.id ? updated : t,
      ),
    }));
  }, []);

  const refresh = useCallback(() => setRefreshTick((n) => n + 1), []);

  return { ...state, refresh, removeTransaction, replaceTransaction };
};
