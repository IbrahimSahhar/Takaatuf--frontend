import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import {
  isPublicRequestsPath,
  storeLoginRedirectOnce,
} from "../utils/authRedirect";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) return;

    const isLogin = location.pathname === ROUTES.LOGIN;
    const isPublicRequests = isPublicRequestsPath(location.pathname);

    // store the intended destination once (avoid overwriting)
    if (!isLogin && !isPublicRequests) {
      storeLoginRedirectOnce(fullPath(location));
    }
  }, [isAuthenticated, loading, location]);

  // avoid redirect decisions while auth is loading
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
