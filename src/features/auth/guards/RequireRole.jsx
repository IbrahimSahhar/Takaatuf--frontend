import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { REDIRECT_KEY } from "../utils/authRedirect";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireRole({ allow = [], children }) {
  const { role, isAuthenticated, isHydrating, profileComplete } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (!isAuthenticated) {
    localStorage.setItem(REDIRECT_KEY, fullPath(location));
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If the user has no role (e.g., hasn't confirmed Gaza/outside-Gaza yet)
  // send them back to the profile completion/confirmation step instead of showing an empty page
  if (!role) {
    // Save the destination so they can return after completing setup
    localStorage.setItem(REDIRECT_KEY, fullPath(location));

    // If profile is incomplete or confirmation is required, redirect to complete profile
    if (!profileComplete) {
      return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
    }

    // Edge case: profile is complete but role is still null (can happen with mock/incomplete data)
    // Also redirect to complete profile to correct the state
    return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
  }

  if (!Array.isArray(allow) || !allow.includes(role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}
