import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome, storeLoginRedirectOnce } from "../utils/authRedirect";

const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function RequireProfileIncomplete({ children }) {
  const { profileComplete, role, loading } = useAuth();
  const location = useLocation();

  // avoid redirect decisions while auth is loading
  if (loading) return null;

  // allow opening the page even if profile is complete (edit mode)
  if (location.state?.allowEdit === true) {
    return children;
  }

  // profile is complete -> go to the role home
  if (profileComplete) {
    return <Navigate to={roleHome(role)} replace />;
  }

  // store where the user wanted to go (once)
  storeLoginRedirectOnce(fullPath(location));

  return children;
}
