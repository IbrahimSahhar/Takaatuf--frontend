import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { REDIRECT_KEY, PROFILE_REDIRECT_KEY } from "../utils/authRedirect";

const LEGACY_LOGIN_REDIRECT_KEY = "redirect_after_login";
const LEGACY_PROFILE_REDIRECT_KEY = "redirect_after_profile";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

const norm = (v) =>
  String(v || "")
    .toLowerCase()
    .trim();

const canonicalizeAllowRole = (r) => {
  const x = norm(r);
  if (x === "kp" || x === "kr" || x === "admin") return x;
  if (x === "knowledge_provider" || x === "provider") return "kp";
  if (x === "knowledge_requester" || x === "requester") return "kr";
  return x;
};

export default function RequireRole({ allow = [], children }) {
  const { role, isAuthenticated, isHydrating, profileComplete } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  const target = fullPath(location);

  const hasRedirectAlready =
    localStorage.getItem(REDIRECT_KEY) ||
    localStorage.getItem(PROFILE_REDIRECT_KEY) ||
    localStorage.getItem(LEGACY_LOGIN_REDIRECT_KEY) ||
    localStorage.getItem(LEGACY_PROFILE_REDIRECT_KEY);

  if (!isAuthenticated) {
    // Don't overwrite existing redirect keys
    if (!hasRedirectAlready) localStorage.setItem(REDIRECT_KEY, target);
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If the user has no role yet, send them to complete profile
  if (!role) {
    if (!hasRedirectAlready) localStorage.setItem(REDIRECT_KEY, target);

    // If profile is incomplete, redirect to complete profile
    if (!profileComplete) {
      return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
    }

    // Edge case: profile complete but role missing -> still go to complete profile
    return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
  }

  const allowed = Array.isArray(allow) ? allow : [];
  const allowedCanonical = allowed.map(canonicalizeAllowRole);

  if (!allowedCanonical.includes(norm(role))) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}
