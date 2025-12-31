import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Container, Navbar, Button } from "react-bootstrap";
import { ROUTES } from "../constants";

/* Storage  */
const REDIRECT_KEY = "redirect_after_login";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  /* Actions  */
  const onLogin = () => {
    const intended = `${location.pathname}${location.search}${location.hash}`;
    localStorage.setItem(REDIRECT_KEY, intended);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Topbar  */}
      <Navbar bg="white" className="border-bottom">
        <Container fluid className="py-2">
          <Navbar.Brand className="fw-semibold">TAKAATUF</Navbar.Brand>

          {/* Public action  */}
          <Button variant="primary" size="sm" onClick={onLogin}>
            Login
          </Button>
        </Container>
      </Navbar>

      {/* Content  */}
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}
