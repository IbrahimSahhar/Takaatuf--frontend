import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { sidebarLinksByRole } from "../../features/dashboards/config/sidebarLinks";

/* 
 Sidebar navigation container.
 Receives navigation links from the dashboard layout
 and renders them without any business logic.
*/
export default function Sidebar() {
  const { role } = useAuth();

  /* 
   Resolve sidebar links based on normalized user role.
   Includes legacy fallback for KR -> requester.
  */
  const navLinks =
    sidebarLinksByRole[role] ||
    (String(role || "").toLowerCase() === "kr"
      ? sidebarLinksByRole["requester"] || []
      : []);
  return (
    <aside className="border rounded bg-white p-3 h-100">
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
    </aside>
  );
}
