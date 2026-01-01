import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { PROFILE_REDIRECT_KEY, REDIRECT_KEY } from "../utils/authRedirect";

/* Legacy keys */
const LEGACY_PROFILE_REDIRECT_KEY = "redirect_after_profile";
const LEGACY_LOGIN_REDIRECT_KEY = "redirect_after_login";

/* Helpers */
const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireProfileComplete({ children }) {
  const { profileComplete, isHydrating, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (!isAuthenticated) return children;

  if (profileComplete) return children;

  if (location.pathname === ROUTES.COMPLETE_PROFILE) return children;

  const target = fullPath(location);

  const hasRedirectAlready =
    localStorage.getItem(PROFILE_REDIRECT_KEY) ||
    localStorage.getItem(LEGACY_PROFILE_REDIRECT_KEY) ||
    localStorage.getItem(REDIRECT_KEY) ||
    localStorage.getItem(LEGACY_LOGIN_REDIRECT_KEY);

  if (!hasRedirectAlready) {
    localStorage.setItem(PROFILE_REDIRECT_KEY, target);
  }

  return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
}
