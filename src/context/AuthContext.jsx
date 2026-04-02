import { createContext, useContext, useMemo, useState } from "react";
import { clearAuthToken, setAuthToken } from "../services/api";
import { sanitizeSessionUser } from "../utils/security";

const AuthContext = createContext(null);
const SESSION_KEY = "itsupport.auth.session";

function getStoredUser() {
  try {
    const rawSession = window.sessionStorage.getItem(SESSION_KEY);
    if (!rawSession) return null;

    return sanitizeSessionUser(JSON.parse(rawSession));
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const role = user?.rol ?? null;

  const persistUser = (userData) => {
    const safeUser = sanitizeSessionUser(userData);
    setUser(safeUser);
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  };

  const login = (userData, token) => {
    persistUser(userData);
    setAuthToken(token);
  };

  const updateUser = (userData) => {
    persistUser({
      ...user,
      ...userData,
    });
  };

  const logout = () => {
    setUser(null);
    window.sessionStorage.removeItem(SESSION_KEY);
    clearAuthToken();
  };

  const isAuthenticated = user !== null;
  const value = useMemo(() => ({ user, role, isAuthenticated, login, updateUser, logout }), [user, role, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
