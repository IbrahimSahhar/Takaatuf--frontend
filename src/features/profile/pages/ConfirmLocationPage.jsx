import { useMemo, useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";
import { api } from "../../../services/api";

const roleFromChoice = (choice) =>
  choice === "IN_GAZA" ? ROLES.REQUESTER : ROLES.KP;

export default function ConfirmLocationPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const { user, setUser } = useAuth();

  const reasonParam = (sp.get("reason") || "unknown").toLowerCase();
  const from = sp.get("from") || "";

  const message = useMemo(() => {
    if (reasonParam === "mismatch") {
      return "We detected you may be in/near Gaza. Please confirm your location.";
    }
    return "We couldn’t determine your location. Please confirm your location.";
  }, [reasonParam]);

  const [choice, setChoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canConfirm = !!choice && !loading;

  const handleConfirm = async () => {
    if (!choice) return;
    setError("");
    setLoading(true);

    try {
      const res = await api.confirmLocation(choice);
      if (!res?.ok) {
        setError(res?.error || "Failed to confirm location.");
        return;
      }

      // Local storage
      localStorage.setItem("takaatuf_location_choice", choice);
      localStorage.setItem(
        "takaatuf_location_confirmed_at",
        new Date().toISOString()
      );

      const ensuredRole = roleFromChoice(choice);

      // Complete profile (contract)
      const payload = {
        ...(user || {}),
        role: ensuredRole,
        name: user?.name || "",
        city: user?.city || "",
        neighborhood: user?.neighborhood || "",
      };

      const prof = await api.completeProfile(payload);
      if (!prof?.ok) {
        setError(prof?.error || "Failed to complete profile.");
        return;
      }

      // Update user and clear the flag
      const updatedUser = {
        ...(user || {}),
        ...prof.user,
        profile_complete: true,
        role: ensuredRole,
        requiresLocationConfirmation: false,
      };
      setUser(updatedUser);

      // Return the user to their intended destination (or dashboard based on role)
      const target = from
        ? decodeURIComponent(from)
        : ensuredRole === ROLES.KP
        ? ROUTES.DASH_KP
        : ensuredRole === ROLES.ADMIN
        ? ROUTES.DASH_ADMIN
        : ROUTES.DASH_REQUESTER;

      navigate(target, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm border-0"
        style={{ maxWidth: 560, width: "100%" }}
      >
        <Card.Body className="p-4 p-md-5">
          <h4 className="fw-bold mb-2">Confirm your location</h4>
          <div className="text-muted mb-4">{message}</div>

          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Form>
            <div className="mb-3">
              <Form.Check
                type="radio"
                id="in-gaza"
                name="location"
                label="I am in Gaza."
                value="IN_GAZA"
                checked={choice === "IN_GAZA"}
                onChange={(e) => setChoice(e.target.value)}
                disabled={loading}
              />
              <Form.Check
                type="radio"
                id="outside-gaza"
                name="location"
                label="I am outside Gaza."
                value="OUTSIDE_GAZA"
                checked={choice === "OUTSIDE_GAZA"}
                onChange={(e) => setChoice(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="d-grid">
              <Button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="py-2 fw-semibold"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Confirming...
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
