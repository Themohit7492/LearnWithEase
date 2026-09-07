import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";
export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const out = async () => {
    await logout();
    nav("/");
  };
  return (
    <header className="navbar">
      <Link to="/" className="logo-link">
        <Logo />
      </Link>
      <nav>
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/start-learning">Start Learning</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            {user.isAdmin && (
              <NavLink to="/admin/chapter">Admin Panel</NavLink>
            )}
            <button className="link-button" onClick={out}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/">Home</NavLink>
            <a href="/#about">About</a>
            <NavLink to="/login">Login</NavLink>
            <Link className="btn btn-small" to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
