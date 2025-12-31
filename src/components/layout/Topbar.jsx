import { Container, Navbar, Button, Badge } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { ROUTES } from "../../constants";

/* Storage */
const REDIRECT_KEY = "redirect_after_login";

/* Helpers */
const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

export default function Topbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === ROUTES.LOGIN;

  /* Actions */
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

  const hiddenRoutes = [ROUTES.LOGIN, ROUTES.COMPLETE_PROFILE];

  if (hiddenRoutes.includes(location.pathname)) {
    return null; // لا Topbar
  }
  return (
    <Navbar bg="white" className="border-bottom">
      <Container fluid className="py-2">
        {/* Brand */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded bg-primary"
            style={{ width: 28, height: 28 }}
            aria-hidden="true"
          />
          <div className="fw-bold text-primary" style={{ letterSpacing: 1 }}>
            TAKAATUF
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex align-items-center gap-3">
          {isAuthenticated && (
            <>
              <span className="text-muted">Role:</span>
              <Badge bg="secondary">
                {String(role || "User").toUpperCase()}
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
