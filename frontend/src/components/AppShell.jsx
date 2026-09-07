import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

import Logo from "./Logo.jsx";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const out = async () => {
    await logout();
    nav("/");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/start-learning">Start Learning</NavLink>
          <NavLink to="/dashboard#subjects">My Subjects</NavLink>
          <NavLink to="/profile#progress">Progress</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          {user?.isAdmin && (
            <NavLink to="/admin/chapter">Admin Panel</NavLink>
          )}
          <button onClick={out}>Logout</button>
        </nav>
      </aside>
      <main className="shell-main">{children}</main>
    </div>
  );
}
