import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireLocationConfirmed({ children }) {
  const { requiresLocationConfirmation, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (requiresLocationConfirmation) {
    const from = encodeURIComponent(fullPath(location));

    return (
      <Navigate
        to={`${ROUTES.CONFIRM_LOCATION}?reason=unknown&from=${from}`}
        replace
      />
    );
  }

  return children;
}
