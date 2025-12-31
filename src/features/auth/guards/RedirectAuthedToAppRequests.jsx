import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { mapPublicToDashboard, APP_BASE } from "../utils/authRedirect";

export default function RedirectAuthedToAppRequests({ children }) {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (isAuthenticated) {
    const mapped = mapPublicToDashboard(
      `${location.pathname}${location.search}${location.hash}`
    );

    return (
      <Navigate
        to={mapped || ROUTES.DASH_REDIRECT || APP_BASE || "/app"}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
