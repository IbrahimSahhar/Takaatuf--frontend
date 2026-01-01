import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { Container, Row, Col, Nav } from "react-bootstrap";
import Topbar from "../components/layout/Topbar";

import { sidebarLinksByRole } from "../features/dashboards/config/sidebarLinks";

export default function DashboardLayout() {
  const { role } = useAuth();

  const navLinks =
    sidebarLinksByRole[role] ||
    (String(role || "").toLowerCase() === "kr"
      ? sidebarLinksByRole["requester"] || []
      : []);

  return (
    <>
      {/* Topbar */}
      <Topbar />

      {/* Body */}
      <Container fluid className="py-4">
        <Row className="g-3">
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2}>
            <div className="border rounded p-3 bg-white">
              <div className="fw-semibold mb-2">Menu</div>

              {navLinks.length === 0 ? (
                <div className="text-muted small">No links for this role.</div>
              ) : (
                <Nav className="flex-column gap-1">
                  {navLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={({ isActive }) =>
                        `text-decoration-none rounded px-2 py-2 d-block ${
                          isActive ? "bg-primary text-white" : "text-dark"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </Nav>
              )}
            </div>
          </Col>

          {/* Content */}
          <Col xs={12} md={9} lg={10}>
            <div
              className="border rounded p-3 bg-white"
              style={{ minHeight: 400 }}
            >
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
