import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuth,
  ensureExpiresAt,
  isSessionExpired,
  loadAuth,
  makeExpiresAt,
  saveAuth,
} from "../utils/authSession";

/* Auth Context */
const AuthContext = createContext(null);

/* Provider */
export function AuthProvider({ children }) {
  /* Initial sync load */
  const initial = loadAuth();

  const [token, setToken] = useState(initial?.token ?? null);
  const [user, _setUser] = useState(initial?.user ?? null);
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt ?? null);

  /* Prevent early redirects */
  const [isHydrating, setIsHydrating] = useState(true);

  const logout = () => {
    setToken(null);
    _setUser(null);
    setExpiresAt(null);
    clearAuth();
  };

  /**
   * Safe setUser:
   * - Supports passing an object or an updater function
   * - Immediately saves to storage if a token and user are present
   */
  const setUser = (next) => {
    _setUser((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;

      // if no token or no user, skip saving
      if (!token || !resolved) return resolved;

      const exp = ensureExpiresAt(expiresAt);
      saveAuth({ token, user: resolved, expiresAt: exp });
      return resolved;
    });
  };

  //  Helper to set requiresLocationConfirmation flag
  const setRequiresLocationConfirmation = (flag) => {
    setUser((prev) => ({
      ...(prev || {}),
      requiresLocationConfirmation: Boolean(flag),
    }));
  };

  useEffect(() => {
    const run = async () => {
      try {
        if (!token) {
          setIsHydrating(false);
          return;
        }

        /* Token without user is invalid */
        if (!user) {
          logout();
          setIsHydrating(false);
          return;
        }
      } catch {
        logout();
      } finally {
        setIsHydrating(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  useEffect(() => {
    if (!token || !user) {
      clearAuth();
      return;
    }

    const exp = ensureExpiresAt(expiresAt);

    if (isSessionExpired(exp)) {
      logout();
      return;
    }

    if (!expiresAt) setExpiresAt(exp);
    saveAuth({ token, user, expiresAt: exp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, expiresAt]);

  const login = ({ token: t, user: u }) => {
    const exp = makeExpiresAt();

    // VITE_REQUIRE_LOC_CONFIRM=true
    const requireLoc =
      String(import.meta.env.VITE_REQUIRE_LOC_CONFIRM || "").toLowerCase() ===
      "true";

    const userWithFlags = {
      ...(u || {}),
      requiresLocationConfirmation:
        typeof u?.requiresLocationConfirmation === "boolean"
          ? u.requiresLocationConfirmation
          : requireLoc,
    };

    setToken(t);
    _setUser(userWithFlags);
    setExpiresAt(exp);
    saveAuth({ token: t, user: userWithFlags, expiresAt: exp });
  };

  const value = useMemo(() => {
    const requiresLocationConfirmation = Boolean(
      user?.requiresLocationConfirmation
    );

    return {
      token,
      user,
      expiresAt,

      isAuthenticated: Boolean(token && user),
      role: user?.role ?? null,
      profileComplete: Boolean(user?.profile_complete),

      requiresLocationConfirmation,
      setRequiresLocationConfirmation,

      isHydrating,
      loading: isHydrating,

      login,
      logout,
      setUser,
    };
  }, [token, user, expiresAt, isHydrating]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* Hook */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
