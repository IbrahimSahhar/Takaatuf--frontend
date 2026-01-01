import { Button, Card, Container, Badge } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";

/* Storage */
const PROFILE_REDIRECT_KEY = "redirect_after_profile";

/* Helpers */
const fullPath = (loc) => `${loc.pathname}${loc.search}${loc.hash}`;

function roleLabel(role) {
  console.log(role);
  if (role === ROLES.KP) return "Knowledge Provider";
  if (role === ROLES.KR) return "Knowledge Requester";
  if (role === ROLES.ADMIN) return "Admin";
  return "User";
}

export default function ProfilePage() {
  const { user, role, profileComplete } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    // Save where user came from so after save we can go back here
    localStorage.setItem(PROFILE_REDIRECT_KEY, fullPath(location));
    navigate(ROUTES.COMPLETE_PROFILE, {
      state: { allowEdit: true },
    });
  };

  const name = user?.name || "-";
  const city = user?.city || user?.city_neighborhood || "-";
  const neighborhood = user?.neighborhood || "-";

  const walletType = user?.wallet_type || "-";
  const walletAddress = user?.wallet_address || "-";
  const paypal = user?.paypal_account || "-";

  return (
    <Container className="py-4" style={{ maxWidth: 900 }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h3 className="fw-bold mb-1">Profile</h3>
          <div className="text-muted">
            View your saved profile details. You can edit them anytime.
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Badge bg={profileComplete ? "success" : "warning"} text="dark">
            {profileComplete ? "Complete" : "Incomplete"}
          </Badge>
          <Button variant="primary" onClick={handleEdit}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="mb-3 shadow-sm border-0">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Personal Information</h5>

          <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between">
              <span className="text-muted">Name</span>
              <span className="fw-semibold">{name}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-muted">City</span>
              <span className="fw-semibold">{city}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-muted">Neighborhood</span>
              <span className="fw-semibold">{neighborhood}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Role */}
      <Card className="mb-3 shadow-sm border-0">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Role</h5>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Current role</span>
            <Badge bg="secondary">{roleLabel(role || user?.role)}</Badge>
          </div>
        </Card.Body>
      </Card>

      {/* Role Details */}
      {String(role || user?.role) === ROLES.KP ? (
        <Card className="mb-3 shadow-sm border-0">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Knowledge Provider Details</h5>

            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Wallet Type</span>
                <span className="fw-semibold">{walletType}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-muted">Wallet Address</span>
                <span
                  className="fw-semibold"
                  style={{ maxWidth: 520, textAlign: "right" }}
                >
                  {walletAddress}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-3 shadow-sm border-0">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Knowledge Requester Details</h5>

            <div className="d-flex justify-content-between">
              <span className="text-muted">PayPal Account</span>
              <span className="fw-semibold">{paypal}</span>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
