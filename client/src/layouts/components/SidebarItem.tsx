import { NavLink } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

export default function SidebarItem({
  icon: Icon,
  label,
  to,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
    >
      <div className="active-indicator" />
      <Icon className="icon" size={20} strokeWidth={2} />
      <span className="label">{label}</span>
    </NavLink>
  );
}
