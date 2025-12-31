import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../utils/authRedirect";

export default function RequireProfileIncomplete({ children }) {
  const { isHydrating, profileComplete, role } = useAuth();

  if (isHydrating) return null;

  if (profileComplete) {
    return <Navigate to={roleHome(role)} replace />;
  }

  return children;
}
