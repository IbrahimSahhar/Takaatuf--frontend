import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";

const REDIRECT_KEY = "redirect_after_login";
const PROFILE_REDIRECT_KEY = "redirect_after_profile";

export const APP_BASE = ROUTES.DASH_REDIRECT || "/app";
export const APP_REQUESTS = ROUTES.APP_REQUESTS || `${APP_BASE}/requests`;

const normalizePath = (path) => (path ? String(path) : "");

/* Map known public URLs to their /app equivalent.
   Returns null when there is no known mapping.
 */
export function mapPublicToDashboard(path) {
  const p = normalizePath(path);
  if (!p) return null;

  const HOME = ROUTES.HOME || "/";

  // "/" => "/app/requests"
  if (p === HOME) return APP_REQUESTS;

  // "/requests" + query/hash => "/app/requests"
  if (
    p === ROUTES.PUBLIC_REQUESTS ||
    p.startsWith(`${ROUTES.PUBLIC_REQUESTS}?`) ||
    p.startsWith(`${ROUTES.PUBLIC_REQUESTS}#`)
  ) {
    return APP_REQUESTS;
  }

  // "/requests/:id..." => "/app/requests/:id..."
  if (p.startsWith(`${ROUTES.PUBLIC_REQUESTS}/`)) {
    return `${APP_BASE}${p}`;
  }

  // no mapping
  return null;
}

export function isPublicRequestsPath(pathname = "") {
  return (
    pathname === ROUTES.PUBLIC_REQUESTS ||
    pathname.startsWith(`${ROUTES.PUBLIC_REQUESTS}/`)
  );
}

export function roleHome(role) {
  switch (String(role || "").toLowerCase()) {
    case ROLES.ADMIN:
      return ROUTES.DASH_ADMIN;
    case ROLES.KP:
      return ROUTES.DASH_KP;
    case ROLES.KR:
    default:
      return ROUTES.DASH_KR;
  }
}

/* -----------------------------
   Peek (read-only)
------------------------------ */
export const peekRedirect = () => localStorage.getItem(REDIRECT_KEY);
export const peekProfileRedirect = () =>
  localStorage.getItem(PROFILE_REDIRECT_KEY);

export const peekNextRedirect = () =>
  localStorage.getItem(PROFILE_REDIRECT_KEY) ||
  localStorage.getItem(REDIRECT_KEY) ||
  null;

/* -----------------------------
   Consume (read + clear)
------------------------------ */
export function consumeRedirect() {
  const next = localStorage.getItem(REDIRECT_KEY);
  localStorage.removeItem(REDIRECT_KEY);
  return next;
}

export function consumeProfileRedirect() {
  const next = localStorage.getItem(PROFILE_REDIRECT_KEY);
  localStorage.removeItem(PROFILE_REDIRECT_KEY);
  return next;
}

export function consumeNextRedirect() {
  const nextRaw = peekNextRedirect();
  if (!nextRaw) return null;

  localStorage.removeItem(PROFILE_REDIRECT_KEY);
  localStorage.removeItem(REDIRECT_KEY);

  return nextRaw;
}

/* -----------------------------
   Store helpers
------------------------------ */
const hasAnyRedirect = () => Boolean(peekProfileRedirect() || peekRedirect());

export function storeLoginRedirectOnce(target) {
  if (!target || hasAnyRedirect()) return;
  localStorage.setItem(REDIRECT_KEY, String(target));
}

export function storeProfileRedirectOnce(target) {
  if (!target || hasAnyRedirect()) return;
  localStorage.setItem(PROFILE_REDIRECT_KEY, String(target));
}
export const storeRedirectOnce = storeLoginRedirectOnce;

export { REDIRECT_KEY, PROFILE_REDIRECT_KEY };
