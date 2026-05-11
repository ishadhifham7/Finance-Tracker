import "../../styles/categories.css";

export default function ActiveBudgetCardSkeleton() {
  return (
    <div className="active-budget-card skeleton">
      <div className="active-budget-color-bar skeleton-pulse" />
      <div className="active-budget-body">
        <div className="active-budget-content">
          <div className="active-budget-info">
            <div
              className="cat-skeleton-name bg-skeleton"
              style={{ width: "70%", height: 24, marginBottom: 12 }}
            ></div>
            <div
              className="bg-skeleton"
              style={{
                width: "90%",
                height: 18,
                marginBottom: 8,
                borderRadius: 4,
              }}
            ></div>
            <div
              className="bg-skeleton"
              style={{ width: "50%", height: 14, borderRadius: 4 }}
            ></div>
          </div>
          <div className="active-budget-ring-container">
            <div
              className="bg-skeleton"
              style={{ width: 90, height: 90, borderRadius: "50%" }}
            ></div>
          </div>
        </div>
        <div className="active-budget-footer">
          <div
            className="bg-skeleton"
            style={{ width: 80, height: 14, borderRadius: 4 }}
          ></div>
          <div
            className="bg-skeleton"
            style={{ width: 30, height: 30, borderRadius: 8 }}
          ></div>
        </div>
      </div>
    </div>
  );
}
