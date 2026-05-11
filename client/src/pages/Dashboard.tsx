import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  MoreHorizontal,
} from "lucide-react";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { formatCurrency } from "../utils/formatCurrency";

const recentTransactions = [
  { name: "No transactions yet", amount: "", type: "empty", category: "" },
];

const budgetItems = [
  { label: "Food & Dining", spent: 0, limit: 500, color: "#00ff66" },
  { label: "Transport", spent: 0, limit: 200, color: "#00cfff" },
  { label: "Entertainment", spent: 0, limit: 150, color: "#a855f7" },
  { label: "Shopping", spent: 0, limit: 300, color: "#f59e0b" },
];

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function Dashboard() {
  const { summary, isLoading, error } = useDashboardSummary();

  const statCards = [
    {
      label: "Total Balance",
      value: summary ? formatCurrency(summary.totalBalance) : "—",
      icon: Wallet,
    },
    {
      label: "Monthly Income",
      value: summary ? formatCurrency(summary.monthlyIncome) : "—",
      icon: TrendingUp,
    },
    {
      label: "Monthly Expenses",
      value: summary ? formatCurrency(summary.monthlyExpenses) : "—",
      icon: TrendingDown,
    },
    {
      label: "Saving Rate",
      value:
        summary && Number.isFinite(summary.savingRate)
          ? `${summary.savingRate.toFixed(1)}%`
          : "—",
      icon: Percent,
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Your financial overview at a glance.</p>
      </header>

      <div className="bento-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          const valueNode = isLoading ? (
            <span className="bento-skeleton-line bento-skeleton-value" />
          ) : (
            card.value
          );
          return (
            <div key={card.label} className="bento-card bento-stat">
              <div className="bento-stat-top">
                <span className="bento-stat-label">{card.label}</span>
                <div className="bento-stat-icon">
                  <Icon size={18} />
                </div>
              </div>
              <div
                className={`bento-stat-value${
                  !isLoading && error ? " muted" : ""
                }`}
              >
                {valueNode}
              </div>
            </div>
          );
        })}

        <div className="bento-card bento-chart">
          <div className="bento-card-header">
            <span className="bento-card-title">Spending Overview</span>
            <button className="bento-more-btn">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="bento-chart-area">
            <div className="bento-chart-bars">
              {chartMonths.map((month) => (
                <div key={month} className="bento-chart-bar-col">
                  <div className="bento-chart-bar-track">
                    <div
                      className="bento-chart-bar-fill"
                      style={{ height: "0%" }}
                    />
                  </div>
                  <span className="bento-chart-label">{month}</span>
                </div>
              ))}
            </div>
            <div className="bento-chart-empty">No data yet</div>
          </div>
        </div>

        <div className="bento-card bento-transactions">
          <div className="bento-card-header">
            <span className="bento-card-title">Recent Transactions</span>
            <a className="bento-view-all">View all</a>
          </div>
          <div className="bento-transaction-list">
            {recentTransactions.map((tx, i) =>
              tx.type === "empty" ? (
                <div key={i} className="bento-tx-empty">
                  No transactions yet
                </div>
              ) : (
                <div key={i} className="bento-tx-row">
                  <div className="bento-tx-info">
                    <span className="bento-tx-name">{tx.name}</span>
                    <span className="bento-tx-cat">{tx.category}</span>
                  </div>
                  <span className={`bento-tx-amount ${tx.type}`}>
                    {tx.amount}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="bento-card bento-budgets">
          <div className="bento-card-header">
            <span className="bento-card-title">Budget Progress</span>
            <a className="bento-view-all">Manage</a>
          </div>
          <div className="bento-budget-list">
            {budgetItems.map((b) => {
              const pct =
                b.limit > 0 ? Math.min((b.spent / b.limit) * 100, 100) : 0;
              return (
                <div key={b.label} className="bento-budget-item">
                  <div className="bento-budget-row">
                    <span className="bento-budget-label">{b.label}</span>
                    <span className="bento-budget-amount">
                      ${b.spent}{" "}
                      <span className="bento-budget-limit">/ ${b.limit}</span>
                    </span>
                  </div>
                  <div className="bento-budget-track">
                    <div
                      className="bento-budget-fill"
                      style={{ width: `${pct}%`, background: b.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bento-card bento-quickstats">
          <div className="bento-card-header">
            <span className="bento-card-title">This Month</span>
          </div>
          <div className="bento-quickstats-grid">
            <div className="bento-qs-item">
              <span className="bento-qs-label">Transactions</span>
              <span className="bento-qs-value">0</span>
            </div>
            <div className="bento-qs-item">
              <span className="bento-qs-label">Categories</span>
              <span className="bento-qs-value">0</span>
            </div>
            <div className="bento-qs-item">
              <span className="bento-qs-label">Avg / Day</span>
              <span className="bento-qs-value">$0</span>
            </div>
            <div className="bento-qs-item">
              <span className="bento-qs-label">Largest</span>
              <span className="bento-qs-value">$0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
