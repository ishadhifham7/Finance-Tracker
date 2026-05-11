export interface Category {
  id: string;
  userId: string;
  name: string;
  type: "income" | "expense" | "both";
  color: string;
  transactionCount?: number;
  createdAt: string;
  updatedAt: string;
}
