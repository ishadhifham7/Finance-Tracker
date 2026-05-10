import { useState } from "react";
import toast from "react-hot-toast";
import TransactionTable from "../components/transactions/TransactionTable";
import FilterBar from "../components/transactions/FilterBar";
import DeleteConfirmModal from "../components/transactions/DeleteConfirmModal";
import EditTransactionModal from "../components/transactions/EditTransactionModal";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction, TransactionFilters } from "../components/transactions/types";
import { DEFAULT_FILTERS } from "../components/transactions/types";
import {
  deleteTransaction,
  updateTransaction,
  type UpdateTransactionPayload,
} from "../services/transactionService";

export default function Transactions() {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);

  const { transactions, isLoading, refresh, removeTransaction, replaceTransaction } =
    useTransactions(filters);

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [editTarget, setEditTarget]     = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [isUpdating, setIsUpdating]     = useState(false);

  const handleEditOpen = (id: string) => {
    setEditTarget(transactions.find((t) => t.id === id) ?? null);
  };

  const handleDeleteOpen = (id: string) => {
    setDeleteTarget(transactions.find((t) => t.id === id) ?? null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    removeTransaction(deleteTarget.id);
    setDeleteTarget(null);
    try {
      await deleteTransaction(deleteTarget.id);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete. Refreshing…");
      refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSave = async (id: string, payload: UpdateTransactionPayload) => {
    setIsUpdating(true);
    try {
      const updated = await updateTransaction(id, payload);
      replaceTransaction(updated);
      setEditTarget(null);
      toast.success("Transaction updated");
    } catch {
      toast.error("Failed to update. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div>
      <header className="page-header">
        <h1>Transactions</h1>
        <p>Track and manage your recent activity.</p>
      </header>

      <div className="tx-page">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onEdit={handleEditOpen}
          onDelete={handleDeleteOpen}
        />
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          transactionTitle={deleteTarget.title}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {editTarget && (
        <EditTransactionModal
          transaction={editTarget}
          isUpdating={isUpdating}
          onSave={handleUpdateSave}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
