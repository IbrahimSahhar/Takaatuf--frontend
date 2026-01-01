import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { useAuth } from "../../features/auth/context/AuthContext";

/* Storage */
const REDIRECT_KEY = "redirect_after_login";

export default function () {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* Temporary Mock Data */
  const requests = [
    {
      id: "1001",
      title: "Request #1001",
      status: "Open",
      summary:
        "Placeholder request preview. This will be powered by backend data later.",
    },
    {
      id: "1002",
      title: "Request #1002",
      status: "Open",
      summary:
        "Another placeholder item. Later we will add pagination and real data.",
    },
  ];

  /* Helpers */
  const saveIntendedAndGoLogin = () => {
    const intended = location.pathname + location.search + location.hash;
    localStorage.setItem(REDIRECT_KEY, intended);
    navigate("/login");
  };

  /* Actions */
  const onViewDetails = (id) => {
    navigate(`/requests/${id}`);
  };

  const onSupport = (id) => {
    if (!isAuthenticated) return saveIntendedAndGoLogin();

    alert(`Support/Tip flow for request #${id} (Coming soon)`);
  };

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h3 className="fw-bold mb-1">Public Requests</h3>
          <div className="text-muted">
            Browse open requests. Support options will be added in a future
            release.
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Badge bg="secondary">Public</Badge>
          <Button variant="outline-dark" disabled>
            Filter (Coming soon)
          </Button>
        </div>
      </div>

      <div className="d-grid gap-3">
        {requests.map((r) => (
          <Card key={r.id} className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-semibold">{r.title}</div>
                <Badge bg="success">{r.status}</Badge>
              </div>

              <div className="text-muted mb-3">{r.summary}</div>

              <div className="d-flex gap-2">
                <Button variant="primary" onClick={() => onSupport(r.id)}>
                  Support / Tip
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => onViewDetails(r.id)}
                >
                  View details
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}
