import { createPortal } from "react-dom";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { Transaction } from "./types";
import type { CreateTransactionPayload } from "../../services/transactionService";

interface Props {
  isCreating: boolean;
  onSave: (payload: CreateTransactionPayload) => void;
  onClose: () => void;
}

const todayInputDate = (): string => new Date().toISOString().slice(0, 10);

export default function CreateTransactionModal({
  isCreating,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    transactionType: "expense",
    date: todayInputDate(),
    note: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  const set =
    (field: keyof typeof form) =>
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
    if (!form.category.trim()) next.category = "Category is required";
    if (!form.date) next.date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateTransactionPayload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category.trim(),
      transactionType: form.transactionType as Transaction["transactionType"],
      date: new Date(form.date).toISOString(),
      note: form.note.trim() || undefined,
    };

    onSave(payload);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-card-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">New Transaction</h2>
            <p className="modal-subtitle">Add a new income or expense</p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isCreating}
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
                  placeholder="e.g. Grocery Run"
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
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Food"
                    value={form.category}
                    onChange={set("category")}
                    maxLength={100}
                  />
                  {errors.category && (
                    <span className="form-error">{errors.category}</span>
                  )}
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
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="btn-spinner" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus size={13} />
                  Create Transaction
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
