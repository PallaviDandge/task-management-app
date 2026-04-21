import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <Link to="/dashboard" className="brand">
          TaskFlow
        </Link>
        <p className="topbar-subtitle">Stay on top of your tasks and deadlines.</p>
      </div>

      <div className="topbar-actions">
        <span className="welcome-text">Hi, {user?.name}</span>
        <Link to="/tasks/new" className="button button-primary">
          Add Task
        </Link>
        <button type="button" className="button button-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
