import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { useAuth } from "../../features/auth/context/AuthContext";
import { ROUTES } from "../../constants/routes";
import { storeLoginRedirectOnce } from "../../features/auth/utils/authRedirect";
import { fullPathFromLocation } from "../../utils/navigation";

export default function PublicRequestDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireLoginThenReturn = () => {
    storeLoginRedirectOnce(fullPathFromLocation(location));
    navigate(ROUTES.LOGIN);
  };

  const onSupport = () => {
    if (!isAuthenticated) return requireLoginThenReturn();

    // Later: open a payment modal or navigate to the payment page
    alert("Support flow (Coming soon)");
  };

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="fw-bold mb-0">Request Details</h4>
            <Badge bg="success">Open</Badge>
          </div>

          <div className="text-muted mb-3">Request ID: {id}</div>
          <div className="text-muted mb-4">
            Placeholder details. Later this will fetch real data from backend.
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary" onClick={onSupport}>
              Support / Tip
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate(ROUTES.PUBLIC_REQUESTS)}
            >
              Back to Requests
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
