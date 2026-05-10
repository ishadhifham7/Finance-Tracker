import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0d10",
        color: "#eef1f6",
        fontFamily: "Space Grotesk, sans-serif",
        textAlign: "center",
        padding: "32px",
      }}
    >
      <div>
        <h1 style={{ marginBottom: "8px" }}>Page not found</h1>
        <p style={{ color: "#9aa4b2", marginBottom: "18px" }}>
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          style={{
            color: "#6ee7ff",
            textDecoration: "none",
            borderBottom: "1px solid transparent",
          }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
