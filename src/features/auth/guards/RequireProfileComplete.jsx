import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { storeProfileRedirectOnce } from "../utils/authRedirect";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireProfileComplete({ children }) {
  const { profileComplete, isAuthenticated, isHydrating } = useAuth();
  const loading = isHydrating;
  const location = useLocation();

  // avoid redirect decisions while auth is loading
  if (loading) return null;

  // if not logged in, don't force profile completion
  if (!isAuthenticated) return children;

  // already complete
  if (profileComplete) return children;

  // allow the profile completion page itself
  if (location.pathname === ROUTES.COMPLETE_PROFILE) return children;

  // store where the user wanted to go (once)
  storeProfileRedirectOnce(fullPath(location));

  return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
}
