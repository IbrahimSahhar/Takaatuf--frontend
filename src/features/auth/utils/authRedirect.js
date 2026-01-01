import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";

const REDIRECT_KEY = "redirect_after_login";
const PROFILE_REDIRECT_KEY = "redirect_after_profile";

const fullPath = (path) => (path ? String(path) : path);

export const APP_BASE = ROUTES.DASH_REDIRECT || "/app";
export const APP_REQUESTS = `${APP_BASE}/requests`;

export function mapPublicToDashboard(path) {
  const p = fullPath(path);
  if (!p) return p;

  // /requests OR /requests?x=1
  if (
    p === ROUTES.PUBLIC_REQUESTS ||
    p.startsWith(`${ROUTES.PUBLIC_REQUESTS}?`)
  ) {
    return APP_REQUESTS;
  }

  // /requests/:id OR /requests/:id?x=1
  if (p.startsWith(`${ROUTES.PUBLIC_REQUESTS}/`)) return `${APP_BASE}${p}`;

  return p;
}

export function isPublicRequestsPath(pathname = "") {
  return (
    pathname === ROUTES.PUBLIC_REQUESTS ||
    pathname.startsWith(`${ROUTES.PUBLIC_REQUESTS}/`)
  );
}

/**
  Canonical role landing:
 - ADMIN -> admin dashboard
 - KP (Gaza) -> KP dashboard
 - KR (Outside Gaza) -> requester dashboard (for now)
 
  Backward compatible:
- REQUESTER -> same as KR
 */
export function roleHome(role) {
  switch (String(role || "").toLowerCase()) {
    case ROLES.ADMIN:
      return ROUTES.DASH_ADMIN;

    case ROLES.KP:
      return ROUTES.DASH_KP;

    //  Outside Gaza
    case ROLES.KR:
    case ROLES.REQUESTER: // backward compatibility
    default:
      return ROUTES.DASH_REQUESTER;
  }
}

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

export { REDIRECT_KEY, PROFILE_REDIRECT_KEY };
