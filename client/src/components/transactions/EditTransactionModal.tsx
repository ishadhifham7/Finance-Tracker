import { createPortal } from "react-dom";
import { useState } from "react";
import { X, Save } from "lucide-react";
import type { Transaction } from "./types";
import type { UpdateTransactionPayload } from "../../services/transactionService";
import CategorySelect from "./CategorySelect";

interface Props {
  transaction: Transaction;
  isUpdating: boolean;
  onSave: (id: string, payload: UpdateTransactionPayload) => void;
  onClose: () => void;
}

const toInputDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

export default function EditTransactionModal({
  transaction,
  isUpdating,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    title: transaction.title,
    amount: String(transaction.amount),
    categoryId:
      transaction.categoryId?.id ?? (null as string | null),
    transactionType: transaction.transactionType,
    date: toInputDate(transaction.date),
    note: transaction.note ?? "",
  });

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    date?: string;
  }>({});

  const set =
    (field: "title" | "amount" | "transactionType" | "date" | "note") =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.title.trim()) next.title = "Title is required";
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0)
      next.amount = "Enter a valid amount";
    if (!form.date) next.date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: UpdateTransactionPayload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      categoryId: form.categoryId,
      transactionType: form.transactionType as Transaction["transactionType"],
      date: new Date(form.date).toISOString(),
      note: form.note.trim() || undefined,
    };

    onSave(transaction.id, payload);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-card-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Transaction</h2>
            <p className="modal-subtitle">Update the details below</p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="modal-form">
              <div className="form-field">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Monthly Salary"
                  value={form.title}
                  onChange={set("title")}
                  maxLength={200}
                />
                {errors.title && (
                  <span className="form-error">{errors.title}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Amount (LKR)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={set("amount")}
                  />
                  {errors.amount && (
                    <span className="form-error">{errors.amount}</span>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={form.transactionType}
                    onChange={set("transactionType")}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <CategorySelect
                    value={form.categoryId}
                    onChange={(id) =>
                      setForm((prev) => ({ ...prev, categoryId: id }))
                    }
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.date}
                    onChange={set("date")}
                  />
                  {errors.date && (
                    <span className="form-error">{errors.date}</span>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Note (optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add a note…"
                  value={form.note}
                  onChange={set("note")}
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-ghost"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="btn-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={13} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
