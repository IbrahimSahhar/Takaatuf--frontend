import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  mapPublicToDashboard,
  roleHome,
  APP_REQUESTS,
  consumeNextRedirect,
} from "../utils/authRedirect";

export default function RedirectIfAuth({ children, fallbackTo }) {
  const { isAuthenticated, role, loading } = useAuth();
  const [target, setTarget] = useState(null);

  const fallback = useMemo(
    () => fallbackTo || APP_REQUESTS || roleHome(role),
    [fallbackTo, role]
  );

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      setTarget(null);
      return;
    }

    const nextRaw = consumeNextRedirect();
    const next = nextRaw ? mapPublicToDashboard(nextRaw) : null;

    setTarget(next || fallback);
  }, [isAuthenticated, loading, fallback]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (isAuthenticated) return <Navigate to={target || fallback} replace />;

  return children;
}
