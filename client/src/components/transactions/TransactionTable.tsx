import "../../styles/transactions.css";
import type { TransactionTableProps } from "./types";
import TransactionRow from "./TransactionRow";
import LoadingSkeletonRow from "./LoadingSkeletonRow";
import EmptyState from "./EmptyState";

const COLUMN_HEADERS = [
  { label: "Title",    className: "tx-col-title"    },
  { label: "Type",     className: "tx-col-type"     },
  { label: "Category", className: "tx-col-category" },
  { label: "Date",     className: "tx-col-date"     },
  { label: "Amount",   className: "tx-col-amount"   },
  { label: "Notes",    className: "tx-col-note"     },
  { label: "",         className: "tx-col-menu"     },
];

export default function TransactionTable({
  transactions,
  isLoading = false,
  skeletonCount = 6,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className="tx-card">
      <div className="tx-table-wrapper">
        <table className="tx-table">
          <colgroup>
            <col className="tx-col-title" />
            <col className="tx-col-type" />
            <col className="tx-col-category" />
            <col className="tx-col-date" />
            <col className="tx-col-amount" />
            <col className="tx-col-note" />
            <col className="tx-col-menu" />
          </colgroup>

          <thead className="tx-thead">
            <tr>
              {COLUMN_HEADERS.map((col, i) => (
                <th key={i} className={col.className}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: skeletonCount }, (_, i) => (
                <LoadingSkeletonRow key={i} index={i} />
              ))
            ) : transactions.length === 0 ? (
              <EmptyState />
            ) : (
              transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
