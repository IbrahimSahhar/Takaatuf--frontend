import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { REDIRECT_KEY, roleHome } from "../utils/authRedirect";

const LEGACY_LOGIN_REDIRECT_KEY = "redirect_after_login";
const LEGACY_PROFILE_REDIRECT_KEY = "redirect_after_profile";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireProfileIncomplete({ children }) {
  const { profileComplete, isHydrating, user } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  //  Allow editing even if profile is complete
  if (location.state?.allowEdit === true) {
    return children;
  }

  if (profileComplete) {
    return <Navigate to={roleHome(user?.role)} replace />;
  }

  const target = fullPath(location);

  const hasRedirectAlready =
    localStorage.getItem(REDIRECT_KEY) ||
    localStorage.getItem(LEGACY_LOGIN_REDIRECT_KEY) ||
    localStorage.getItem(LEGACY_PROFILE_REDIRECT_KEY);

  if (!hasRedirectAlready) {
    localStorage.setItem(REDIRECT_KEY, target);
  }

  return children;
}
