import { useRef, useState } from "react";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import type { Transaction } from "./types";
import ActionMenuDropdown from "./ActionMenuDropdown";

interface Props {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatAmount = (amount: number): string =>
  `LKR ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export default function TransactionRow({
  transaction,
  onEdit,
  onDelete,
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

  const isIncome = transaction.transactionType === "income";
  const cat = transaction.categoryId;

  return (
    <tr className="tx-row">
      {/* Title */}
      <td className="tx-td tx-col-title" title={transaction.title}>
        <span className="tx-title-text">{transaction.title}</span>
      </td>

      {/* Type */}
      <td className="tx-td tx-col-type">
        <span className={`tx-type-badge ${transaction.transactionType}`}>
          {isIncome ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isIncome ? "Income" : "Expense"}
        </span>
      </td>

      {/* Category */}
      <td className="tx-td tx-col-category">
        {cat ? (
          <span
            style={{
              color: cat.color,
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            {cat.name}
          </span>
        ) : (
          <span style={{ color: "#9ca3af", fontSize: "14px" }}>
            Uncategorized
          </span>
        )}
      </td>

      {/* Date */}
      <td className="tx-td tx-col-date">
        <span className="tx-date-text">{formatDate(transaction.date)}</span>
      </td>

      {/* Amount */}
      <td className="tx-td tx-col-amount tx-amount-cell">
        <span className="tx-amount-text" style={{ color: "#9ca3af" }}>
          {isIncome ? "+" : "−"}&thinsp;{formatAmount(transaction.amount)}
        </span>
      </td>

      {/* Note */}
      <td className="tx-td tx-col-note" title={transaction.note || undefined}>
        {transaction.note ? (
          <span className="tx-note-text">{transaction.note}</span>
        ) : (
          <span className="tx-note-empty">—</span>
        )}
      </td>

      {/* Menu */}
      <td className="tx-td tx-col-menu tx-menu-cell">
        <button
          ref={btnRef}
          className={`tx-menu-btn${menuOpen ? " open" : ""}`}
          onClick={handleMenuToggle}
          aria-label="Transaction actions"
        >
          <MoreHorizontal size={15} />
        </button>

        {menuOpen && (
          <ActionMenuDropdown
            position={menuPos}
            onEdit={() => onEdit(transaction.id)}
            onDelete={() => onDelete(transaction.id)}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </td>
    </tr>
  );
}
