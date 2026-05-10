import { LayoutDashboard, ArrowRightLeft, Folders, LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="brand-accent">●</span>
        <span className="brand-name">FinTrack</span>
      </div>

      <nav className="sidebar-nav">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
        <SidebarItem
          icon={ArrowRightLeft}
          label="Transactions"
          to="/transactions"
        />
        <SidebarItem icon={Folders} label="Budgets" to="/budgets" />
      </nav>

      {/* Logout button typically pushed to bottom, so we add an auto margin wrapper if needed. 
          For mobile it joins the row. Desktop it goes to the bottom. */}
      <div
        style={{ marginTop: "auto", padding: "16px" }}
        className="sidebar-footer"
      >
        <button
          onClick={logout}
          className="sidebar-item"
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut className="icon" size={20} strokeWidth={2} />
          <span className="label">Log out</span>
        </button>
      </div>
    </aside>
  );
}
