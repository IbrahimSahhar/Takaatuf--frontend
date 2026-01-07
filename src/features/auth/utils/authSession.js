const STORAGE_KEY = "takaatuf_auth";
const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000;

const now = () => Date.now();

const toNumber = (v) => {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
};

const isExpired = (expiresAt) =>
  typeof expiresAt === "number" && expiresAt <= now();

/*
 Load auth snapshot from localStorage.
  - Returns null if missing / invalid / expired.
  - Clears storage if expired or corrupted.
 */
export function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Basic shape check
    const token = parsed?.token ?? null;
    const user = parsed?.user ?? null;

    // Normalize expiresAt
    const exp = toNumber(parsed?.expiresAt);

    // If expiresAt is present and expired => clear
    if (exp && isExpired(exp)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // If token exists but user missing (or vice versa), treat as invalid session
    if ((token && !user) || (!token && user)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      token,
      user,
      expiresAt: exp, // may be null (AuthContext will ensure it)
    };
  } catch {
    // Corrupted storage entry
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

/*
  Save auth snapshot to localStorage.
  - Wrapped in try/catch to avoid crashing UI if storage is unavailable.
 */
export function saveAuth({ token, user, expiresAt }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token, user, expiresAt })
    );
  } catch {
    // Storage might be full/blocked; fail silently.
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
  Ensure expiresAt exists and is valid.
  - If invalid/missing => generate a fresh TTL from now.
 */
export function ensureExpiresAt(expiresAt) {
  const exp = toNumber(expiresAt);
  return exp ?? now() + SESSION_TTL_MS;
}

export function makeExpiresAt() {
  return now() + SESSION_TTL_MS;
}

export function isSessionExpired(expiresAt) {
  const exp = toNumber(expiresAt);
  return exp ? isExpired(exp) : false;
}
