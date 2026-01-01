import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  mapPublicToDashboard,
  roleHome,
  REDIRECT_KEY,
  PROFILE_REDIRECT_KEY,
} from "../utils/authRedirect";

export default function RedirectIfAuth({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    // If there is a stored redirect (login/profile), prefer it
    const nextRaw =
      localStorage.getItem(PROFILE_REDIRECT_KEY) ||
      localStorage.getItem(REDIRECT_KEY);

    // Clear keys to avoid loops
    localStorage.removeItem(PROFILE_REDIRECT_KEY);
    localStorage.removeItem(REDIRECT_KEY);

    const next = nextRaw ? mapPublicToDashboard(nextRaw) : null;

    return <Navigate to={next || roleHome(user?.role)} replace />;
  }

  return children;
}
