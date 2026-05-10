export interface Transaction {
  id: string;
  title: string;
  transactionType: "income" | "expense";
  category: string;
  date: string;
  amount: number;
  note?: string;
}

export interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  skeletonCount?: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface TransactionFilters {
  search: string;
  type: "income" | "expense" | "";
  category: string;
  startDate: string;
  endDate: string;
  sort: "newest" | "oldest" | "highest" | "lowest";
}

export const DEFAULT_FILTERS: TransactionFilters = {
  search: "",
  type: "",
  category: "",
  startDate: "",
  endDate: "",
  sort: "newest",
};
