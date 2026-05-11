import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  MoreHorizontal,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useMonthlyTrends } from "../hooks/useMonthlyTrends";
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

export default function Dashboard() {
  const { summary, isLoading, error } = useDashboardSummary();
  const { trends, isLoading: isLoadingTrends } = useMonthlyTrends();

  // Generate the last 6 months to ensure the chart always has 6 data points.
  // This pads missing months with 0s so lines draw completely from a 0 baseline.
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      // Create date for (now - i months)
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const found = trends.find((t) => t.month === monthStr);
      data.push({
        name: d.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        income: found?.income || 0,
        expenses: found?.expenses || 0,
      });
    }
    return data;
  }, [trends]);

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
          <div
            className="bento-chart-area"
            style={{ height: "250px", position: "relative" }}
          >
            {isLoadingTrends ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="bento-skeleton-line"
                  style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    dot={{ fill: "#10b981", r: 2 }}
                    activeDot={false}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    dot={{ fill: "#ef4444", r: 2 }}
                    activeDot={false}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="bento-chart-empty">No data yet</div>
            )}
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

        <div
          className="bento-card"
          style={{
            gridColumn: "span 2",
            minHeight: "250px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="bento-card-header">
            <span className="bento-card-title">Expense Breakdown</span>
            <button className="bento-more-btn">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              border: "1px dashed var(--border)",
              borderRadius: "8px",
              margin: "16px 0 0",
            }}
          >
            [Pie Chart Placeholder]
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
