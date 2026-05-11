import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import type { BudgetAnalytics } from "../../services/budgetService";
import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  budget: BudgetAnalytics;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCard({ budget, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const pct = budget.progressPercentage;
  const isExceeded = budget.exceeded;
  const ringColor = isExceeded ? "#ff4d6d" : "var(--accent-neon)";
  const trackColor = "rgba(255,255,255,0.06)";

  const strokeWidth = 8;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isExceeded
    ? 0
    : circumference - (pct / 100) * circumference;

  const toggleMenu = () => {
    if (!menuOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.right,
        width: rect.width,
      });
    }
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    setMenuOpen(false);
    action();
  };

  return (
    <div className={`active-budget-card ${isExceeded ? "exceeded" : ""}`}>
      <div
        className="active-budget-color-bar"
        style={
          {
            "--cat-color": budget.category.color ?? "#6b7280",
          } as React.CSSProperties
        }
      />
      <div className="active-budget-body">
        <div className="active-budget-content">
          <div className="active-budget-info">
            <h3 className="active-budget-name">
              {budget.category.name ?? "Unknown"}
            </h3>

            <div className="active-budget-amounts">
              <span className={`amount-spent ${isExceeded ? "danger" : ""}`}>
                {formatCurrency(budget.spentAmount)}
              </span>
              <span className="amount-divider">/</span>
              <span className="amount-limit">
                {formatCurrency(budget.budgetAmount)}
              </span>
            </div>

            {isExceeded ? (
              <p className="active-budget-status danger">
                Exceeded by{" "}
                {formatCurrency(budget.spentAmount - budget.budgetAmount)}
              </p>
            ) : (
              <p className="active-budget-status">
                {formatCurrency(budget.remainingAmount)} remaining
              </p>
            )}
          </div>

          <div className="active-budget-ring-container">
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              className="budget-ring-svg"
            >
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke={trackColor}
                strokeWidth={strokeWidth}
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="budget-ring-progress"
              />
            </svg>
            <div className="budget-ring-label">
              <span className={`budget-pct ${isExceeded ? "danger" : ""}`}>
                {pct}%
              </span>
            </div>
          </div>
        </div>

        <div className="active-budget-footer">
          <div className="active-budget-period">Monthly Budget</div>

          <button
            ref={btnRef}
            className={`cat-menu-btn ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Budget options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="cat-dropdown budget-dropdown"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left - 140, // rough width
            }}
          >
            <button
              className="cat-dropdown-item"
              onClick={(e) => handleAction(e, () => onEdit(budget.id))}
            >
              <Edit2 size={14} />
              Edit Budget
            </button>
            <div className="cat-dropdown-divider" />
            <button
              className="cat-dropdown-item danger"
              onClick={(e) => handleAction(e, () => onDelete(budget.id))}
            >
              <Trash2 size={14} />
              Remove Budget
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
