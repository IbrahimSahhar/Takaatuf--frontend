import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { REDIRECT_KEY, isPublicRequestsPath } from "../utils/authRedirect";

const LEGACY_LOGIN_REDIRECT_KEY = "redirect_after_login";
const LEGACY_PROFILE_REDIRECT_KEY = "redirect_after_profile";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireAuth({ children }) {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (!isAuthenticated) {
    const isLogin = location.pathname === ROUTES.LOGIN;
    const isPublic = isPublicRequestsPath(location.pathname);

    if (!isLogin && !isPublic) {
      const target = fullPath(location);

      const hasRedirectAlready =
        localStorage.getItem(REDIRECT_KEY) ||
        localStorage.getItem(LEGACY_LOGIN_REDIRECT_KEY) ||
        localStorage.getItem(LEGACY_PROFILE_REDIRECT_KEY);

      if (!hasRedirectAlready) {
        localStorage.setItem(REDIRECT_KEY, target);
      }
    }

    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
