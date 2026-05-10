import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoadingScreen = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0d10",
        color: "#eef1f6",
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      <div
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.3em",
          fontSize: "12px",
          opacity: 0.7,
        }}
      >
        Loading
      </div>
    </div>
  );
};

export default function PublicRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
