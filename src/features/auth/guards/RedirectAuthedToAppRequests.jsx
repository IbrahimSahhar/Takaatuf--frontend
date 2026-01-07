import { Navigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { mapPublicToDashboard, APP_REQUESTS } from "../utils/authRedirect";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RedirectAuthedToAppRequests({ children }) {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  const loading = isHydrating;

  const fallback = APP_REQUESTS || ROUTES.APP_REQUESTS;

  const target = useMemo(() => {
    if (!isAuthenticated) return null;

    const mapped = mapPublicToDashboard(fullPath(location));

    if (mapped && String(mapped).startsWith("/app")) return mapped;

    return fallback;
  }, [isAuthenticated, location, fallback]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={target || fallback} replace />;
  }

  return children;
}
