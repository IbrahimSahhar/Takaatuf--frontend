import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearAuth,
  ensureExpiresAt,
  isSessionExpired,
  loadAuth,
  makeExpiresAt,
  saveAuth,
} from "../utils/authSession";

import { canonicalizeRole } from "./auth.roles";
import {
  computeMissingProfileFields,
  computeProfileComplete,
} from "./auth.profile";

/* Auth Context */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initial = loadAuth();

  const [token, setToken] = useState(initial?.token ?? null);
  const [user, _setUser] = useState(initial?.user ?? null);
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt ?? null);
  const [isHydrating, setIsHydrating] = useState(true);

  /**
    Derived/memoized user snapshot:
    - Normalizes role (kp/kr)
    - Resolves profile_complete to a boolean when missing
    - Computes missing profile fields once per user change
   */
  const derived = useMemo(() => {
    if (!user) {
      return {
        userWithProfile: null,
        missingProfileFields: [],
        profileComplete: false,
        requiresLocationConfirmation: false,
      };
    }

    const role = canonicalizeRole(user?.role);

    const userWithProfile = {
      ...user,
      role,
      // Ensure requiresLocationConfirmation is boolean (nice for UI/guards)
      requiresLocationConfirmation: Boolean(user?.requiresLocationConfirmation),
      // Ensure profile_complete is boolean (backend flag > local mock > inferred)
      profile_complete:
        typeof user?.profile_complete === "boolean"
          ? user.profile_complete
          : computeProfileComplete({ ...user, role }),
    };

    return {
      userWithProfile,
      missingProfileFields: computeMissingProfileFields(userWithProfile),
      profileComplete: Boolean(userWithProfile.profile_complete),
      requiresLocationConfirmation: Boolean(
        userWithProfile.requiresLocationConfirmation
      ),
    };
  }, [user]);

  /**
   * Logout: clears state + storage
   */
  const logout = useCallback(() => {
    setToken(null);
    _setUser(null);
    setExpiresAt(null);
    clearAuth();
  }, []);

  /**
    setUser: update user in state.
    NOTE: we do NOT save here to avoid double-saving.
    Saving is centralized in the Persist effect below.
   */
  const setUser = useCallback((next) => {
    _setUser((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;

      // Normalize role quickly (so consumers get consistent role ASAP)
      if (!resolved) return resolved;
      return {
        ...resolved,
        role: canonicalizeRole(resolved?.role),
      };
    });
  }, []);

  /**
   * Set location confirmation flag on the user
   */
  const setRequiresLocationConfirmation = useCallback(
    (flag) => {
      setUser((prev) => ({
        ...(prev || {}),
        requiresLocationConfirmation: Boolean(flag),
      }));
    },
    [setUser]
  );

  /**
    Hydration:
    - When token exists but user doesn't => session is invalid => logout
    - Mark hydration complete once token state is known
   */
  useEffect(() => {
    try {
      if (token && !user) logout();
    } catch {
      logout();
    } finally {
      setIsHydrating(false);
    }
  }, [token, user, logout]);

  /*
    Persist + Expiry:
    Centralized place for:
    - ensuring expiresAt exists
    - checking expiration
    - saving auth snapshot (token + derived user + expiresAt)
   */
  useEffect(() => {
    // Not authenticated => clear storage
    if (!token || !user) {
      clearAuth();
      return;
    }

    const exp = ensureExpiresAt(expiresAt);

    // Expired => logout
    if (isSessionExpired(exp)) {
      logout();
      return;
    }

    // Ensure local state has expiresAt
    if (!expiresAt) setExpiresAt(exp);

    // Save the most correct user snapshot (normalized + profile_complete resolved)
    const toSave = derived.userWithProfile || user;
    saveAuth({ token, user: toSave, expiresAt: exp });
  }, [token, user, expiresAt, derived.userWithProfile, logout]);

  /**
    login:
    - sets token/user/expiresAt in state
    - saving is handled by Persist effect to avoid duplicate writes
   */
  const login = useCallback(({ token: t, user: u }) => {
    const exp = makeExpiresAt();

    const requireLoc =
      String(import.meta.env.VITE_REQUIRE_LOC_CONFIRM || "").toLowerCase() ===
      "true";

    const role = canonicalizeRole(u?.role);

    const userWithFlags = {
      ...(u || {}),
      role,
      requiresLocationConfirmation:
        typeof u?.requiresLocationConfirmation === "boolean"
          ? u.requiresLocationConfirmation
          : requireLoc,
    };

    const userWithProfile = {
      ...userWithFlags,
      profile_complete:
        typeof userWithFlags?.profile_complete === "boolean"
          ? userWithFlags.profile_complete
          : computeProfileComplete(userWithFlags),
    };

    setToken(t);
    _setUser(userWithProfile);
    setExpiresAt(exp);
  }, []);

  /**
    Context value:
    - Keep stable references where possible
    - Expose both loading and ready flags for UI/guards
   */
  const value = useMemo(() => {
    const finalUser = derived.userWithProfile ?? user;

    return {
      token,
      user: finalUser,
      expiresAt,

      isAuthenticated: Boolean(token && finalUser),
      role: finalUser?.role ?? null,

      profileComplete: derived.profileComplete,
      missingProfileFields: derived.missingProfileFields,

      requiresLocationConfirmation: derived.requiresLocationConfirmation,
      setRequiresLocationConfirmation,

      isHydrating,
      loading: isHydrating,
      ready: !isHydrating,

      login,
      logout,
      setUser,
    };
  }, [
    token,
    user,
    expiresAt,
    isHydrating,
    derived,
    login,
    logout,
    setUser,
    setRequiresLocationConfirmation,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* Hook */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
