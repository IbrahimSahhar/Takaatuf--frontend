import { Container, Navbar, Button, Badge } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { ROUTES } from "../../constants";

/* 
 Key used to persist the user's current location before redirecting to login
*/
const REDIRECT_KEY = "redirect_after_login";

/* Builds full URL path */
const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function Topbar() {
  const { isAuthenticated, logout, user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === ROUTES.LOGIN;

  const handleLoginClick = () => {
    if (!isLoginPage) {
      localStorage.setItem(REDIRECT_KEY, fullPath(location));
    }
    navigate(ROUTES.LOGIN);
  };

  const handleLogoutClick = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const HIDDEN_ROUTES = [ROUTES.COMPLETE_PROFILE];
  if (HIDDEN_ROUTES.includes(location.pathname)) return null;

  return (
    <Navbar bg="white" className="border-bottom topbar">
      <Container fluid className="py-2">
        {/* Brand */}
        <div className="d-flex align-items-center gap-2">
          <div className="topbar-logo" aria-hidden="true" />
          <div className="topbar-brand">TAKAATUF</div>
        </div>

        {/* Actions */}
        <div className="d-flex align-items-center gap-3">
          {isAuthenticated && (
            <>
              <span className="text-muted">Role:</span>
              <Badge bg="secondary">
                {String(role ?? "user").toUpperCase()}
              </Badge>

              <span className="text-muted small d-none d-md-inline">
                {user?.name || user?.email}
              </span>
            </>
          )}

          {isAuthenticated ? (
            <Button
              variant="outline-primary"
              className="px-3"
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          ) : isLoginPage ? null : (
            <Button
              variant="primary"
              className="px-3"
              onClick={handleLoginClick}
            >
              Login
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
}
