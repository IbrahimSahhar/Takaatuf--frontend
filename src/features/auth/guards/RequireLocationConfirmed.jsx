import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireLocationConfirmed({ children }) {
  const { requiresLocationConfirmation, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (location.pathname === ROUTES.CONFIRM_LOCATION) {
    return children;
  }

  if (requiresLocationConfirmation) {
    const fromRaw = fullPath(location);

    const from =
      fromRaw && fromRaw !== ROUTES.CONFIRM_LOCATION
        ? encodeURIComponent(fromRaw)
        : "";

    const qs = from ? `?reason=unknown&from=${from}` : `?reason=unknown`;

    return <Navigate to={`${ROUTES.CONFIRM_LOCATION}${qs}`} replace />;
  }

  return children;
}
