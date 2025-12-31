import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { REDIRECT_KEY } from "../utils/authRedirect";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireProfileComplete({ children }) {
  const { profileComplete, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  // If the profile is incomplete
  if (!profileComplete) {
    // If already on the complete profile page, don't navigate
    // (prevents loop / flicker)
    if (location.pathname === ROUTES.COMPLETE_PROFILE) {
      return children;
    }

    // Save the destination the user was trying to reach
    localStorage.setItem(REDIRECT_KEY, fullPath(location));

    // Redirect them to the complete profile page
    return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
  }

  return children;
}
