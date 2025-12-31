import { useState } from "react";
import { Button, Card, Container, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";
import LocationConfirmationModal from "../../profile/components/LocationConfirmationModal";
import PrivacyNotice from "../../../components/common/PrivacyNotice";
import {
  getLocationDecision,
  LOCATION_STATUS,
} from "../locationFlow/locationDecisionProvider";
import { api } from "../../../services/api";

/* Storage */
const USERS_KEY = "takaatuf_users";
const REDIRECT_AFTER_PROFILE_KEY = "redirect_after_profile";
const REDIRECT_AFTER_LOGIN_KEY = "redirect_after_login";

/* Helpers */
const APP_BASE = ROUTES.DASH_REDIRECT || "/app";
const APP_REQUESTS = `${APP_BASE}/requests`;

const fullPath = (path) => (path ? String(path) : path);

function mapPublicToDashboard(path) {
  const p = fullPath(path);
  if (!p) return p;
  if (p === ROUTES.PUBLIC_REQUESTS) return APP_REQUESTS;
  if (p.startsWith(`${ROUTES.PUBLIC_REQUESTS}/`)) return `${APP_BASE}${p}`;
  return p;
}

function roleHome(role) {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.DASH_ADMIN;
    case ROLES.KP:
      return ROUTES.DASH_KP;
    case ROLES.REQUESTER:
    default:
      return ROUTES.DASH_REQUESTER;
  }
}

/** Temporary: change this based on Gaza/outside-Gaza rule */
const roleFromChoice = (choice) =>
  choice === "IN_GAZA" ? ROLES.REQUESTER : ROLES.KP;

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, role } = useAuth();

  const [fullName, setFullName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "");
  const [neighborhood, setNeighborhood] = useState(user?.neighborhood || "");
  const [error, setError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmReason, setConfirmReason] = useState("UNKNOWN");
  const [pendingName, setPendingName] = useState("");

  const persistMockUser = (updatedUser) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      const key = `${updatedUser?.provider || "email"}:${
        updatedUser?.email || "unknown"
      }`;

      if (users[key]) {
        users[key] = {
          ...users[key],
          name: updatedUser.name,
          profile_complete: updatedUser.profile_complete,
          role: updatedUser.role,
          city: updatedUser.city,
          neighborhood: updatedUser.neighborhood,
          // Also save the flag (in the mock store)
          requiresLocationConfirmation: Boolean(
            updatedUser.requiresLocationConfirmation
          ),
        };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch {}
  };

  const doRedirect = (roleValue) => {
    const nextRaw =
      localStorage.getItem(REDIRECT_AFTER_PROFILE_KEY) ||
      localStorage.getItem(REDIRECT_AFTER_LOGIN_KEY);

    const nextSafe =
      nextRaw && nextRaw !== ROUTES.COMPLETE_PROFILE
        ? mapPublicToDashboard(nextRaw)
        : null;

    localStorage.removeItem(REDIRECT_AFTER_PROFILE_KEY);
    localStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);

    navigate(nextSafe || roleHome(roleValue), { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const nameTrimmed = fullName.trim();
    if (!nameTrimmed) {
      setError("Please enter your full name.");
      return;
    }

    setPendingName(nameTrimmed);

    setUser({
      ...(user || {}),
      name: nameTrimmed,
      city: city.trim(),
      neighborhood: neighborhood.trim(),
    });

    // Location decision from a single source
    const decision = await getLocationDecision();

    // If MATCH: proceed (and call the API contract)
    if (decision.status === LOCATION_STATUS.MATCH) {
      const ensuredRole = user?.role || role || ROLES.REQUESTER;

      const payload = {
        ...(user || {}),
        name: nameTrimmed,
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        role: ensuredRole,
      };

      const res = await api.completeProfile(payload);
      if (!res?.ok) {
        setError(res?.error || "Failed to complete profile.");
        return;
      }

      const updatedUser = {
        ...(user || {}),
        ...res.user,
        profile_complete: true,
        role: ensuredRole,
        // MATCH means no location confirmation required
        requiresLocationConfirmation: false,
      };

      setUser(updatedUser);
      persistMockUser(updatedUser);

      doRedirect(updatedUser.role);
      return;
    }

    // If MISMATCH/UNKNOWN: set flag so Guards block the dashboard
    setUser((prev) => ({
      ...(prev || {}),
      requiresLocationConfirmation: true,
    }));

    // Open the confirmation modal
    setConfirmReason(decision.reason || "UNKNOWN");
    setShowConfirm(true);
  };

  const handleConfirmLocation = async (choice) => {
    // API contract
    const res = await api.confirmLocation(choice);
    if (!res?.ok) {
      setError(res?.error || "Failed to confirm location.");
      return;
    }

    // Local storage (frontend)
    localStorage.setItem("takaatuf_location_choice", choice);
    localStorage.setItem(
      "takaatuf_location_confirmed_at",
      new Date().toISOString()
    );

    const ensuredRole = roleFromChoice(choice);

    // Complete profile (contract)
    const payload = {
      ...(user || {}),
      name: pendingName || user?.name || "",
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      role: ensuredRole,
    };

    const prof = await api.completeProfile(payload);
    if (!prof?.ok) {
      setError(prof?.error || "Failed to complete profile.");
      return;
    }

    const updatedUser = {
      ...(user || {}),
      ...prof.user,
      profile_complete: true,
      role: ensuredRole,
      // After confirmation, turn off the flag
      requiresLocationConfirmation: false,
    };

    setUser(updatedUser);
    persistMockUser(updatedUser);

    localStorage.removeItem(REDIRECT_AFTER_PROFILE_KEY);
    localStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);

    setShowConfirm(false);

    setTimeout(() => {
      navigate(roleHome(ensuredRole), { replace: true });
    }, 0);
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm border-0"
        style={{ maxWidth: 520, width: "100%" }}
      >
        <Card.Body className="p-4 p-md-5">
          <h3 className="fw-bold mb-2">Complete Your Profile</h3>
          <div className="text-muted mb-4">
            Please fill required fields before proceeding.
          </div>

          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Form onSubmit={submit}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label className="fw-semibold">Full Name *</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city">
              <Form.Label className="fw-semibold">City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
              <PrivacyNotice
                text="We use your city/neighborhood to improve matching."
                to="/privacy"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="neighborhood">
              <Form.Label className="fw-semibold">Neighborhood</Form.Label>
              <Form.Control
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Enter your neighborhood"
              />
              <PrivacyNotice
                text="We use your city/neighborhood to improve matching."
                to="/privacy"
              />
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" className="py-2 fw-semibold">
                Save & Continue
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <LocationConfirmationModal
        show={showConfirm}
        reason={confirmReason}
        onConfirm={handleConfirmLocation}
        onClose={() => setShowConfirm(false)}
      />
    </Container>
  );
}
