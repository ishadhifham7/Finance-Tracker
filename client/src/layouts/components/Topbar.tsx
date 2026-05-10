import { Search, Bell, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { currentUser } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input type="text" placeholder="Search transactions, budgets..." />
      </div>

      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button className="icon-button" aria-label="Profile">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              style={{ width: 24, height: 24, borderRadius: "50%" }}
            />
          ) : (
            <UserIcon size={20} />
          )}
        </button>
      </div>
    </header>
  );
}
