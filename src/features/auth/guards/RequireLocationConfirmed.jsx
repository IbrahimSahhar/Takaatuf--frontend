import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;
const REASON = "unknown";

export default function RequireLocationConfirmed({ children }) {
  const { requiresLocationConfirmation, isHydrating } = useAuth();
  const loading = isHydrating;
  const location = useLocation();

  // avoid redirect decisions while auth is loading
  if (loading) return null;

  // allow access to the confirm location page itself
  if (location.pathname === ROUTES.CONFIRM_LOCATION) {
    return children;
  }

  if (requiresLocationConfirmation) {
    const fromRaw = fullPath(location);

    // don't set "from" to confirm-location itself
    const from =
      fromRaw && fromRaw !== ROUTES.CONFIRM_LOCATION ? fromRaw : null;

    const qs = new URLSearchParams({ reason: REASON });
    if (from) qs.set("from", from);

    return (
      <Navigate to={`${ROUTES.CONFIRM_LOCATION}?${qs.toString()}`} replace />
    );
  }

  return children;
}
