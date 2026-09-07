import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";
export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return setError("Passwords do not match");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    try {
      const user = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      nav(user.isAdmin ? "/admin/chapter" : "/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Logo />
        <div>
          <h1>Create your account</h1>
          <p>Build a learning path that grows with you.</p>
        </div>
        {error && <div className="alert error">{error}</div>}
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
        </label>
        <button className="btn">Create Account</button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
