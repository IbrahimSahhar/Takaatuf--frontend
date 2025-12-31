import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { REDIRECT_KEY, isPublicRequestsPath } from "../utils/authRedirect";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireAuth({ children }) {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (!isAuthenticated) {
    const isLogin = location.pathname === ROUTES.LOGIN;
    const isPublic = isPublicRequestsPath(location.pathname);

    if (!isLogin && !isPublic) {
      localStorage.setItem(REDIRECT_KEY, fullPath(location));
    }

    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
