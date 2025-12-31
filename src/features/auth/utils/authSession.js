const STORAGE_KEY = "takaatuf_auth";
const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000;

const now = () => Date.now();

const isExpired = (expiresAt) =>
  typeof expiresAt === "number" && expiresAt <= now();

export function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed?.expiresAt && isExpired(parsed.expiresAt)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveAuth({ token, user, expiresAt }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user, expiresAt }));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function ensureExpiresAt(expiresAt) {
  return expiresAt ?? now() + SESSION_TTL_MS;
}

export function makeExpiresAt() {
  return now() + SESSION_TTL_MS;
}

export function isSessionExpired(expiresAt) {
  return isExpired(expiresAt);
}
