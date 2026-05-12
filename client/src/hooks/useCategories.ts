import { useState, useEffect } from "react";
import { fetchCategories } from "../services/categoryService";
import { fetchTransactions } from "../services/transactionService";
import type { Category } from "../components/categories/types";
import type { Transaction } from "../components/transactions/types";

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetchAllTransactions = async (): Promise<Transaction[]> => {
      const all: Transaction[] = [];
      const limit = 100;
      let page = 1;

      while (true) {
        const data = await fetchTransactions({ page, limit, sort: "newest" });
        all.push(...data.items);
        if (!data.pagination.hasNext) break;
        page += 1;
      }

      return all;
    };

    const run = async () => {
      try {
        const categories = await fetchCategories();
        const hasCounts = categories.every(
          (category) => typeof category.transactionCount === "number",
        );

        if (hasCounts) {
          if (!cancelled) {
            setCategories(categories);
            setIsLoading(false);
          }
          return;
        }

        let countByCategory: Record<string, number> = {};

        try {
          const transactions = await fetchAllTransactions();
          countByCategory = transactions.reduce<Record<string, number>>(
            (acc, tx) => {
              const categoryId = tx.categoryId?.id;
              if (!categoryId) return acc;
              acc[categoryId] = (acc[categoryId] ?? 0) + 1;
              return acc;
            },
            {},
          );
        } catch {
          countByCategory = {};
        }

        if (!cancelled) {
          setCategories(
            categories.map((category) => ({
              ...category,
              transactionCount: countByCategory[category.id] ?? 0,
            })),
          );
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load categories. Please try again.");
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [refreshTick]);

  const refresh = () => setRefreshTick((t) => t + 1);

  return { categories, isLoading, error, refresh };
}
