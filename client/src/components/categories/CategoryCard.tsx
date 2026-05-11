import { useRef, useState } from "react";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
} from "lucide-react";
import type { Category } from "./types";
import CategoryActionMenu from "./CategoryActionMenu";

interface Props {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAllocateBudget: (id: string, anchorRect: DOMRect) => void;
}

const TYPE_CONFIG = {
  income: {
    label: "Income",
    icon: TrendingUp,
    className: "cat-type-income",
  },
  expense: {
    label: "Expense",
    icon: TrendingDown,
    className: "cat-type-expense",
  },
  both: {
    label: "All types",
    icon: Minus,
    className: "cat-type-both",
  },
} as const;

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onAllocateBudget,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = () => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(true);
  };

  const config = TYPE_CONFIG[category.type];
  const TypeIcon = config.icon;
  const txCount = category.transactionCount ?? 0;

  return (
    <div
      className="cat-card"
      style={{ "--cat-color": category.color } as React.CSSProperties}
    >
      <div className="cat-card-color-bar" />

      <div className="cat-card-body">
        <div className="cat-card-top">
          <h3 className="cat-card-name">{category.name}</h3>
          <span className={`cat-type-badge ${config.className}`}>
            <TypeIcon size={11} strokeWidth={2.5} />
            {config.label}
          </span>
        </div>

        <p className="cat-tx-count">
          {txCount === 0
            ? "No transactions"
            : `${txCount} ${txCount === 1 ? "Transaction" : "Transactions"}`}
        </p>

        <div className="cat-card-footer">
          <button
            className="cat-allocate-btn"
            type="button"
            onClick={(e) =>
              onAllocateBudget(
                category.id,
                (e.currentTarget as HTMLButtonElement).getBoundingClientRect(),
              )
            }
          >
            <Wallet size={13} strokeWidth={2} />
            Allocate Budget
          </button>

          <button
            ref={btnRef}
            className={`cat-menu-btn${menuOpen ? " open" : ""}`}
            type="button"
            onClick={handleMenuToggle}
            aria-label="Category actions"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <CategoryActionMenu
              position={menuPos}
              onEdit={() => onEdit(category.id)}
              onDelete={() => onDelete(category.id)}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
