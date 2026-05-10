import { Search, CalendarDays, RotateCcw, Tag, ArrowUpDown } from "lucide-react";
import type { TransactionFilters } from "./types";
import FilterDropdown from "./FilterDropdown";

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

const TYPE_OPTIONS = [
  { value: "",        label: "All Types"  },
  { value: "income",  label: "Income"     },
  { value: "expense", label: "Expense"    },
];

const SORT_OPTIONS = [
  { value: "newest",  label: "Newest First"  },
  { value: "oldest",  label: "Oldest First"  },
  { value: "highest", label: "Highest Amount"},
  { value: "lowest",  label: "Lowest Amount" },
];

// Placeholder list — not wired to API yet
const CATEGORY_OPTIONS = [
  { value: "",             label: "All Categories" },
  { value: "salary",       label: "Salary"         },
  { value: "freelance",    label: "Freelance"       },
  { value: "food",         label: "Food"            },
  { value: "transport",    label: "Transport"       },
  { value: "utilities",    label: "Utilities"       },
  { value: "entertainment",label: "Entertainment"   },
  { value: "investments",  label: "Investments"     },
];

const set =
  <K extends keyof TransactionFilters>(
    key: K,
    onChange: Props["onChange"],
    filters: TransactionFilters,
  ) =>
  (value: TransactionFilters[K]) =>
    onChange({ ...filters, [key]: value });

export default function FilterBar({ filters, onChange, onReset }: Props) {
  const isFiltered =
    filters.search !== "" ||
    filters.type !== "" ||
    filters.category !== "" ||
    filters.startDate !== "" ||
    filters.endDate !== "" ||
    filters.sort !== "newest";

  return (
    <div className="filter-bar">
      {/* ── Search ── */}
      <div className="filter-search-wrap">
        <Search size={14} className="filter-search-icon" />
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search transactions…"
          value={filters.search}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value })
          }
        />
        {filters.search && (
          <button
            className="filter-search-clear"
            onClick={() => onChange({ ...filters, search: "" })}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Type ── */}
      <FilterDropdown
        value={filters.type}
        options={TYPE_OPTIONS}
        placeholder="All Types"
        onChange={set("type", onChange, filters)}
        minWidth={118}
      />

      {/* ── Category (UI only) ── */}
      <div className="filter-ui-only-wrap">
        <div className="filter-ui-only-badge">
          <Tag size={10} />
          soon
        </div>
        <FilterDropdown
          value={filters.category}
          options={CATEGORY_OPTIONS}
          placeholder="Category"
          onChange={set("category", onChange, filters)}
          minWidth={130}
          disabled={false}
        />
      </div>

      {/* ── Date range ── */}
      <div className="filter-date-range">
        <div className="filter-date-wrap">
          <CalendarDays size={13} className="filter-date-icon" />
          <input
            type="date"
            className="filter-date-input"
            value={filters.startDate}
            onChange={(e) =>
              onChange({ ...filters, startDate: e.target.value })
            }
          />
        </div>
        <span className="filter-date-sep">→</span>
        <div className="filter-date-wrap">
          <CalendarDays size={13} className="filter-date-icon" />
          <input
            type="date"
            className="filter-date-input"
            value={filters.endDate}
            min={filters.startDate || undefined}
            onChange={(e) =>
              onChange({ ...filters, endDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* ── Sort ── */}
      <div className="filter-sort-wrap">
        <ArrowUpDown size={13} className="filter-sort-icon" />
        <FilterDropdown
          value={filters.sort}
          options={SORT_OPTIONS}
          placeholder="Sort"
          onChange={set("sort", onChange, filters)}
          minWidth={148}
        />
      </div>

      {/* ── Reset ── */}
      <button
        type="button"
        className={`filter-reset-btn${isFiltered ? " visible" : ""}`}
        onClick={onReset}
        aria-label="Reset filters"
        title="Reset all filters"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
