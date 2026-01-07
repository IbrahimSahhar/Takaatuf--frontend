import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { storeLoginRedirectOnce } from "../utils/authRedirect";
import { canonicalizeRole } from "../context/auth.roles";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;
const norm = (v) =>
  String(v || "")
    .toLowerCase()
    .trim();

export default function RequireRole({ allow = [], children }) {
  const { role, isAuthenticated, loading, profileComplete } = useAuth();
  const location = useLocation();

  // avoid redirect decisions while auth is loading
  if (loading) return null;

  const target = fullPath(location);

  // not logged in -> remember target and go to login
  if (!isAuthenticated) {
    storeLoginRedirectOnce(target);
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const currentRole = canonicalizeRole(role);

  // no role yet -> go complete profile
  if (!currentRole) {
    storeLoginRedirectOnce(target);
    return (
      <Navigate
        to={profileComplete ? ROUTES.COMPLETE_PROFILE : ROUTES.COMPLETE_PROFILE}
        replace
      />
    );
  }

  // normalize allowed roles (support legacy aliases via canonicalizeRole)
  const allowed = Array.isArray(allow) ? allow : [];
  const allowedCanonical = allowed.map(canonicalizeRole).filter(Boolean);

  if (!allowedCanonical.includes(norm(currentRole))) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}
