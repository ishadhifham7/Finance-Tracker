import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Wallet, Percent } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useMonthlyTrends } from "../hooks/useMonthlyTrends";
import { useExpenseDistribution } from "../hooks/useExpenseDistribution";
import { useRecentTransactions } from "../hooks/useRecentTransactions";
import { useBudgets } from "../hooks/useBudgets";
import { formatCurrency } from "../utils/formatCurrency";

const formatTransactionDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatTransactionAmount = (
  amount: number,
  type: "income" | "expense",
) => {
  const sign = type === "income" ? "+" : "-";
  const value = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${sign}${value} LKR`;
};

const formatBudgetAmount = (amount: number) =>
  Math.round(amount).toLocaleString("en-US");

export default function Dashboard() {
  const { summary, isLoading, error } = useDashboardSummary();
  const { trends, isLoading: isLoadingTrends } = useMonthlyTrends();
  const { distribution, isLoading: isLoadingDistribution } =
    useExpenseDistribution();
  const { transactions: recentTransactions, isLoading: isLoadingRecent } =
    useRecentTransactions();
  const { budgets, isLoading: isBudgetsLoading } = useBudgets();

  const totalExpenseDistribution = useMemo(
    () => distribution.reduce((sum, item) => sum + item.amount, 0),
    [distribution],
  );

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
        <h1 className="pb-10">Dashboard</h1>
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
            <span className="bento-card-title">Income vs Expenses</span>
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
            <Link className="bento-view-all" to="/transactions">
              View all
            </Link>
          </div>
          <div className="bento-transaction-list">
            {isLoadingRecent ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`tx-skeleton-${i}`} className="bento-tx-row">
                  <div className="bento-tx-info" style={{ width: "70%" }}>
                    <span
                      className="bento-skeleton-line"
                      style={{ width: "75%", height: "8px" }}
                    />
                    <span
                      className="bento-skeleton-line"
                      style={{ width: "35%", height: "6px" }}
                    />
                  </div>
                  <span
                    className="bento-skeleton-line"
                    style={{ width: "70px", height: "8px" }}
                  />
                </div>
              ))
            ) : recentTransactions.length === 0 ? (
              <div className="bento-tx-empty">No transactions yet</div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="bento-tx-row">
                  <div className="bento-tx-info">
                    <span className="bento-tx-name" title={tx.title}>
                      {tx.title}
                    </span>
                    <span className="bento-tx-cat">
                      {formatTransactionDate(tx.date)}
                    </span>
                  </div>
                  <span className={`bento-tx-amount ${tx.transactionType}`}>
                    {formatTransactionAmount(tx.amount, tx.transactionType)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bento-card bento-budgets">
          <div className="bento-card-header">
            <span className="bento-card-title">Budget Progress</span>
            <Link className="bento-view-all" to="/categories">
              Manage
            </Link>
          </div>
          <div className="bento-budget-list">
            {isBudgetsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`budget-skeleton-${i}`} className="bento-budget-item">
                  <div className="bento-budget-row">
                    <span
                      className="bento-skeleton-line"
                      style={{ width: "40%", height: "10px" }}
                    />
                    <span
                      className="bento-skeleton-line"
                      style={{ width: "35%", height: "10px" }}
                    />
                  </div>
                  <div className="bento-budget-track">
                    <div
                      className="bento-skeleton-line"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              ))
            ) : budgets.length === 0 ? (
              <div className="bento-budget-empty">No budgets yet</div>
            ) : (
              budgets.map((b) => {
                const pct = Math.min(Math.max(b.progressPercentage, 0), 100);
                const spent = formatBudgetAmount(b.spentAmount);
                const limit = formatBudgetAmount(b.budgetAmount);

                return (
                  <div key={b.id} className="bento-budget-item">
                    <div className="bento-budget-row">
                      <span
                        className="bento-budget-label"
                        title={b.category.name ?? "Unknown"}
                      >
                        {b.category.name ?? "Unknown"}
                      </span>
                      <span className="bento-budget-amount">
                        {spent}{" "}
                        <span className="bento-budget-limit">
                          / {limit} LKR
                        </span>
                      </span>
                    </div>
                    <div className="bento-budget-track">
                      <div
                        className="bento-budget-fill"
                        style={{
                          width: `${pct}%`,
                          background: "rgba(255, 255, 255, 0.85)",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
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
          {/* Header */}
          <div
            className="bento-card-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            <span className="bento-card-title">Expense Distribution</span>

            {/* Monthly Pill */}
            <span
              style={{
                fontSize: "12px",
                padding: "2px 10px",
                borderRadius: "999px",
                border: "1px solid #9ca3af",
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              Monthly
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              marginTop: "16px",
            }}
          >
            {isLoadingDistribution ? (
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
                  style={{ width: "100%", height: "80%", borderRadius: "8px" }}
                />
              </div>
            ) : distribution.length > 0 ? (
              <>
                {/* Left Side: Donut Chart area */}
                <div
                  style={{
                    width: "50%",
                    height: "180px",
                    position: "relative",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribution}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        stroke="none"
                        paddingAngle={4}
                      >
                        {distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Text */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginBottom: "2px",
                      }}
                    >
                      Total Expenses
                    </span>
                    <span
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {totalExpenseDistribution.toLocaleString("en-US")}{" "}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          fontWeight: 400,
                        }}
                      >
                        LKR
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Side: Legend */}
                <div
                  style={{
                    width: "50%",
                    paddingLeft: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "180px",
                    overflowY: "auto",
                  }}
                >
                  {distribution.map((item) => (
                    <div
                      key={item.category}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          color: "var(--text-muted)",
                          fontWeight: 500,
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: item.color,
                          }}
                        />
                        {item.category}
                      </div>

                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--text-main)",
                          whiteSpace: "nowrap",
                          marginLeft: "12px",
                        }}
                      >
                        {item.amount.toLocaleString("en-US")}{" "}
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            fontWeight: 400,
                          }}
                        >
                          LKR
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                className="bento-chart-empty"
                style={{ width: "100%", textAlign: "center" }}
              >
                No expenses yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
