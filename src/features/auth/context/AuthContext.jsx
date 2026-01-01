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

/*  Profile helpers  */
const LS_PROFILE_COMPLETE_KEY = "profile_complete_mock";

/* Role helpers */
const normalizeRole = (role) =>
  String(role || "")
    .toLowerCase()
    .trim();

/*
   Canonical roles across the app:
   kp = Gaza
   kr = Outside Gaza
 */
const canonicalizeRole = (role) => {
  const r = normalizeRole(role);

  if (r === "kp" || r === "kr") return r;

  // Provider aliases → kp (Gaza)
  if (r === "knowledge_provider" || r === "provider") return "kp";

  // Requester aliases → kr (Outside Gaza)
  if (r === "knowledge_requester" || r === "requester") return "kr";

  return r || "";
};

const get = (obj, ...keys) => {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== "") return obj[k];
  }
  return null;
};

const isNonEmpty = (v) => v != null && String(v).trim().length > 0;

const validateWalletAddress = (type, address) => {
  const t = String(type || "").toLowerCase();
  const a = String(address || "").trim();

  if (!a) return false;

  if (t === "ethereum") return /^0x[a-fA-F0-9]{40}$/.test(a);
  if (t === "bitcoin")
    return (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(a) ||
      /^bc1[ac-hj-np-z02-9]{25,90}$/.test(a)
    );
  if (t === "solana") return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a);

  return true;
};

const computeMissingProfileFields = (u) => {
  const missing = [];

  const name = get(u, "name", "fullName", "full_name");
  const city = get(
    u,
    "city",
    "neighborhood",
    "cityNeighborhood",
    "city_neighborhood"
  );

  if (!isNonEmpty(name)) missing.push("name");
  if (!isNonEmpty(city)) missing.push("city_neighborhood");

  const role = canonicalizeRole(get(u, "role"));
  if (!role) missing.push("role");

  // Role-based requirements
  if (role === "kp") {
    const walletType = get(
      u,
      "walletType",
      "wallet_type",
      "cryptoWalletType",
      "crypto_wallet_type"
    );
    const walletAddress = get(
      u,
      "walletAddress",
      "wallet_address",
      "cryptoWalletAddress",
      "crypto_wallet_address"
    );

    if (!isNonEmpty(walletType)) missing.push("wallet_type");
    if (!isNonEmpty(walletAddress)) missing.push("wallet_address");

    if (isNonEmpty(walletType) && isNonEmpty(walletAddress)) {
      if (!validateWalletAddress(walletType, walletAddress)) {
        missing.push("wallet_address_invalid");
      }
    }
  }

  if (role === "kr") {
    const paypal = get(
      u,
      "paypalAccount",
      "paypal_account",
      "paypalEmail",
      "paypal_email"
    );
    if (!isNonEmpty(paypal)) missing.push("paypal_account");
  }

  return missing;
};

const computeProfileComplete = (u) => {
  const backendFlag = get(
    u,
    "profile_complete",
    "profileComplete",
    "profile_completed"
  );
  if (typeof backendFlag === "boolean") return backendFlag;

  const missing = computeMissingProfileFields(u);
  const isComplete = missing.length === 0;

  const ls = localStorage.getItem(LS_PROFILE_COMPLETE_KEY);
  if (ls === "true" || ls === "false") return ls === "true";

  return isComplete;
};

/* Provider */
export function AuthProvider({ children }) {
  const initial = loadAuth();

  const [token, setToken] = useState(initial?.token ?? null);
  const [user, _setUser] = useState(initial?.user ?? null);
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt ?? null);
  const [isHydrating, setIsHydrating] = useState(true);

  const logout = () => {
    setToken(null);
    _setUser(null);
    setExpiresAt(null);
    clearAuth();
  };

  const setUser = (next) => {
    _setUser((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      if (!token || !resolved) return resolved;

      const resolvedWithProfile = {
        ...resolved,
        role: canonicalizeRole(resolved?.role),
        profile_complete:
          typeof resolved?.profile_complete === "boolean"
            ? resolved.profile_complete
            : computeProfileComplete(resolved),
      };

      const exp = ensureExpiresAt(expiresAt);
      saveAuth({ token, user: resolvedWithProfile, expiresAt: exp });
      return resolvedWithProfile;
    });
  };

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

        if (!user) {
          logout();
          setIsHydrating(false);
          return;
        }

        if (typeof user?.profile_complete !== "boolean") {
          _setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              profile_complete: computeProfileComplete(prev),
            };
          });
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

    const userWithProfile = {
      ...user,
      role: canonicalizeRole(user?.role),
      profile_complete:
        typeof user?.profile_complete === "boolean"
          ? user.profile_complete
          : computeProfileComplete(user),
    };

    saveAuth({ token, user: userWithProfile, expiresAt: exp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, expiresAt]);

  const login = ({ token: t, user: u }) => {
    const exp = makeExpiresAt();

    const requireLoc =
      String(import.meta.env.VITE_REQUIRE_LOC_CONFIRM || "").toLowerCase() ===
      "true";

    const userWithFlags = {
      ...(u || {}),
      role: canonicalizeRole(u?.role),
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
    saveAuth({ token: t, user: userWithProfile, expiresAt: exp });
  };

  const value = useMemo(() => {
    const requiresLocationConfirmation = Boolean(
      user?.requiresLocationConfirmation
    );

    const missingProfileFields = user ? computeMissingProfileFields(user) : [];
    const profileComplete = Boolean(user && computeProfileComplete(user));

    return {
      token,
      user,
      expiresAt,

      isAuthenticated: Boolean(token && user),
      role: user?.role ?? null,

      profileComplete,
      missingProfileFields,

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
