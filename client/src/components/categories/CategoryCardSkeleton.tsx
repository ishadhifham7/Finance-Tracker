export default function CategoryCardSkeleton() {
  return (
    <div className="cat-card cat-card-skeleton">
      <div className="cat-skeleton-top">
        <div className="cat-skeleton-name" />
        <div className="cat-skeleton-badge" />
      </div>
      <div className="cat-skeleton-count" />
      <div className="cat-skeleton-footer">
        <div className="cat-skeleton-btn" />
        <div className="cat-skeleton-menu" />
      </div>
    </div>
  );
}
