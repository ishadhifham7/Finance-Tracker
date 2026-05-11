import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Category } from "../categories/types";
import {
  createBudget,
  type CreateBudgetPayload,
} from "../../services/budgetService";

interface Props {
  category: Category;
  anchorRect: DOMRect;
  onClose: () => void;
  onCreated: () => void;
}

export default function AllocateBudgetPopover({
  category,
  anchorRect,
  onClose,
  onCreated,
}: Props) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const width = 280;
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const margin = 12;
    const left = Math.min(
      Math.max(anchorRect.left, margin),
      window.innerWidth - width - margin,
    );

    let top = anchorRect.bottom + 8;
    const panelHeight = panelRef.current?.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - top - margin;

    if (panelHeight && spaceBelow < panelHeight) {
      const aboveTop = anchorRect.top - panelHeight - 8;
      top =
        aboveTop >= margin
          ? aboveTop
          : Math.max(margin, window.innerHeight - panelHeight - margin);
    }

    setPosition({ top, left });
  }, [anchorRect.left, anchorRect.bottom, anchorRect.top, width]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const validate = (): boolean => {
    const value = Number(amount);
    if (!amount || isNaN(value) || value <= 0) {
      setError("Enter a valid amount");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateBudgetPayload = {
      categoryId: category.id,
      amount: Number(amount),
      period: "monthly",
    };

    setIsSubmitting(true);
    try {
      await createBudget(payload);
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create budget";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="budget-popover"
      ref={panelRef}
      style={{ top: position.top, left: position.left, width }}
    >
      <div className="budget-popover-header">
        <div>
          <p className="budget-popover-title">Allocate Budget</p>
          <p className="budget-popover-sub">{category.name}</p>
        </div>
        <button
          type="button"
          className="budget-popover-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="budget-popover-form" noValidate>
        <label className="budget-popover-label">Monthly Amount (LKR)</label>
        <input
          className="budget-popover-input"
          type="number"
          placeholder="Enter monthly budget amount"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting}
        />
        {error && <span className="budget-popover-error">{error}</span>}

        <div className="budget-popover-actions">
          <button
            type="button"
            className="budget-popover-btn ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="budget-popover-btn primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Allocate"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
