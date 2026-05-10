import { ArrowRightLeft } from "lucide-react";

export default function EmptyState() {
  return (
    <tr>
      <td colSpan={7}>
        <div className="tx-empty">
          <div className="tx-empty-icon">
            <ArrowRightLeft size={22} />
          </div>
          <p className="tx-empty-title">No transactions found</p>
          <p className="tx-empty-sub">
            Your transactions will appear here once added.
          </p>
        </div>
      </td>
    </tr>
  );
}
