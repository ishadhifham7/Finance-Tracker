import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "../styles/layout.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
