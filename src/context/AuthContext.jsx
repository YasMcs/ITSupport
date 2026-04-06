import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { clearAuthToken, getAuthToken, setAuthToken, subscribeToAuthFailures } from "../services/api";
import { isTokenExpired, sanitizeSessionUser } from "../utils/security";

const AuthContext = createContext(null);
const SESSION_KEY = "itsupport.auth.session";
const EXPIRED_SESSION_KEY = "itsupport.auth.expired";

function getInitialAuthState() {
  try {
    const expiredFlag = window.sessionStorage.getItem(EXPIRED_SESSION_KEY);
    if (expiredFlag) {
      window.sessionStorage.removeItem(EXPIRED_SESSION_KEY);
    }

    const token = getAuthToken();
    if (!token || isTokenExpired(token)) {
      const hasStoredSession = Boolean(window.sessionStorage.getItem(SESSION_KEY));
      window.sessionStorage.removeItem(SESSION_KEY);
      clearAuthToken();
      return {
        user: null,
        logoutReason: hasStoredSession || expiredFlag ? "expired" : null,
      };
    }

    const rawSession = window.sessionStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      return {
        user: null,
        logoutReason: null,
      };
    }

    return {
      user: sanitizeSessionUser(JSON.parse(rawSession)),
      logoutReason: expiredFlag ? "expired" : null,
    };
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    clearAuthToken();
    return {
      user: null,
      logoutReason: null,
    };
  }
}

export function AuthProvider({ children }) {
  const [{ user, logoutReason }, setAuthState] = useState(() => getInitialAuthState());
  const hasRedirectedForExpiredSession = useRef(false);
  const role = user?.rol ?? null;

  const login = (userData, token) => {
    const safeUser = sanitizeSessionUser(userData);
    hasRedirectedForExpiredSession.current = false;
    setAuthState({
      user: safeUser,
      logoutReason: null,
    });
    window.sessionStorage.removeItem(EXPIRED_SESSION_KEY);
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    setAuthToken(token);
  };

  const logout = () => {
    hasRedirectedForExpiredSession.current = false;
    setAuthState({
      user: null,
      logoutReason: null,
    });
    window.sessionStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(EXPIRED_SESSION_KEY);
    clearAuthToken();
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthFailures(({ status }) => {
      if (status !== 401 && status !== 403) return;

      if (!user || hasRedirectedForExpiredSession.current) return;

      hasRedirectedForExpiredSession.current = true;
      window.sessionStorage.removeItem(SESSION_KEY);
      window.sessionStorage.setItem(EXPIRED_SESSION_KEY, "1");
      clearAuthToken();
      setAuthState({
        user: null,
        logoutReason: "expired",
      });
    });

    return unsubscribe;
  }, [user]);

  const isAuthenticated = user !== null;
  const value = useMemo(
    () => ({ user, role, isAuthenticated, logoutReason, login, logout }),
    [user, role, isAuthenticated, logoutReason],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
