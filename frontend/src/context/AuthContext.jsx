import { createContext, useContext, useEffect, useState } from "react";
import { get, post, patch } from "../services/api.js";
const AuthContext = createContext(null);
const SESSION_KEY = "learnwithease:session";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleAuthExpired = () => setUser(null);
    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, []);
  useEffect(() => {
    if (localStorage.getItem(SESSION_KEY) !== "true") {
      setLoading(false);
      return;
    }
    get("/auth/me")
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);
  const login = async (payload) => {
    const u = await post("/auth/login", payload);
    localStorage.setItem(SESSION_KEY, "true");
    setUser(u);
    return u;
  };
  const signup = async (payload) => {
    const u = await post("/auth/signup", payload);
    localStorage.setItem(SESSION_KEY, "true");
    setUser(u);
    return u;
  };
  const logout = async () => {
    await post("/auth/logout");
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };
  const updateLearning = async (payload) => {
    const u = await patch("/auth/profile/learning", payload);
    setUser(u);
    return u;
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateLearning }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
