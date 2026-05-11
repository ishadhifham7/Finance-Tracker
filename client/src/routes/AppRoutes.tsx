import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import PublicRoute from "../components/shared/PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Categories from "../pages/Categories";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Publicly accessible (e.g. Auth) pages */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Private Dashboard pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
