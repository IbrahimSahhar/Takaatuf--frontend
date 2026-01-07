import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Container, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";
import { WALLET_TYPES, WALLET_TYPE_OPTIONS } from "../../../constants/wallets";
import LocationConfirmationModal from "../../profile/components/LocationConfirmationModal";
import {
  getLocationDecision,
  LOCATION_STATUS,
} from "../locationFlow/locationDecisionProvider";
import { api } from "../../../services/api";
import {
  mapPublicToDashboard,
  roleHome,
  PROFILE_REDIRECT_KEY,
  REDIRECT_KEY,
} from "../../auth/utils/authRedirect";

/* Storage */
const USERS_KEY = "takaatuf_users";

const LEGACY_PROFILE_REDIRECT_KEY = "redirect_after_profile";
const LEGACY_LOGIN_REDIRECT_KEY = "redirect_after_login";

/* Wallet validators */
const isEth = (v) => /^0x[a-fA-F0-9]{40}$/.test(v);
const isSol = (v) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v);
const isBtc = (v) =>
  /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(v) ||
  /^bc1[ac-hj-np-z02-9]{25,90}$/.test(v);

function validateWallet(type, address) {
  if (!type || !address) return false;
  if (type === WALLET_TYPES.ETHEREUM) return isEth(address);
  if (type === WALLET_TYPES.SOLANA) return isSol(address);
  if (type === WALLET_TYPES.BITCOIN) return isBtc(address);
  return false;
}

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  /* Common fields */
  const [fullName, setFullName] = useState(user?.name || "");
  const [cityNeighborhood, setCityNeighborhood] = useState(
    user?.city_neighborhood || user?.city || ""
  );

  /* Role selection */
  const [selectedRole, setSelectedRole] = useState(user?.role || ROLES.KP);

  /* Role-based fields */
  const [walletType, setWalletType] = useState(user?.wallet_type || "");
  const [walletAddress, setWalletAddress] = useState(
    user?.wallet_address || ""
  );
  const [paypalAccount, setPaypalAccount] = useState(
    user?.paypal_account || ""
  );

  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmReason, setConfirmReason] = useState("UNKNOWN");
  const [pendingPayload, setPendingPayload] = useState(null);

  const redirectedMissing = location?.state?.missingProfileFields;

  const missingToShow = useMemo(() => {
    const arr = Array.isArray(redirectedMissing) ? redirectedMissing : [];
    return Array.from(new Set(arr));
  }, [redirectedMissing]);

  const isProfileIncomplete = useMemo(() => {
    return !Boolean(user?.profile_complete);
  }, [user]);

  /* Re-validate wallet when type changes */
  useEffect(() => {
    if (selectedRole !== ROLES.KP) return;

    if (walletAddress && walletType) {
      if (!validateWallet(walletType, walletAddress)) {
        setErrors((e) => ({
          ...e,
          wallet_address: "Wallet address is invalid for selected type.",
        }));
      } else {
        setErrors((e) => ({ ...e, wallet_address: null }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletType]);

  const validate = () => {
    const next = {};

    if (!fullName.trim()) next.name = "Name is required.";
    if (!cityNeighborhood.trim())
      next.city_neighborhood = "City/Neighborhood is required.";

    if (selectedRole === ROLES.KP) {
      if (!walletType) next.wallet_type = "Wallet type is required.";
      if (!walletAddress) next.wallet_address = "Wallet address is required.";
      else if (!validateWallet(walletType, walletAddress))
        next.wallet_address = "Wallet address is invalid.";
    }

    if (selectedRole === ROLES.KR) {
      if (!paypalAccount.trim())
        next.paypal_account = "PayPal account is required.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const persistMockUser = (updatedUser) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      const key = `${updatedUser?.provider || "email"}:${
        updatedUser?.email || "unknown"
      }`;
      if (users[key]) {
        users[key] = { ...users[key], ...updatedUser };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch {}
  };

  const clearAllRedirectKeys = () => {
    localStorage.removeItem(PROFILE_REDIRECT_KEY);
    localStorage.removeItem(REDIRECT_KEY);
    localStorage.removeItem(LEGACY_PROFILE_REDIRECT_KEY);
    localStorage.removeItem(LEGACY_LOGIN_REDIRECT_KEY);
  };

  const readNextRedirect = () => {
    return (
      localStorage.getItem(PROFILE_REDIRECT_KEY) ||
      localStorage.getItem(LEGACY_PROFILE_REDIRECT_KEY) ||
      localStorage.getItem(REDIRECT_KEY) ||
      localStorage.getItem(LEGACY_LOGIN_REDIRECT_KEY)
    );
  };

  const doRedirect = (roleValue) => {
    const nextRaw = readNextRedirect();

    //  always clear ALL keys before final navigate
    clearAllRedirectKeys();

    const next =
      nextRaw && nextRaw !== ROUTES.COMPLETE_PROFILE
        ? mapPublicToDashboard(nextRaw)
        : null;

    navigate(next || roleHome(roleValue), { replace: true });
  };

  const onCancel = () => {
    const nextRaw = readNextRedirect();

    if (nextRaw && nextRaw !== ROUTES.COMPLETE_PROFILE) {
      clearAllRedirectKeys();
      navigate(mapPublicToDashboard(nextRaw) || nextRaw, { replace: true });
      return;
    }

    clearAllRedirectKeys();
    navigate(-1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setPageError("");

    if (!validate()) return;

    const payload = {
      ...(user || {}),
      name: fullName.trim(),
      city_neighborhood: cityNeighborhood.trim(),
      role: selectedRole,
      wallet_type: selectedRole === ROLES.KP ? walletType : undefined,
      wallet_address: selectedRole === ROLES.KP ? walletAddress : undefined,
      paypal_account:
        selectedRole === ROLES.KR ? paypalAccount.trim() : undefined,
    };

    setPendingPayload(payload);

    const decision = await getLocationDecision();

    if (decision.status === LOCATION_STATUS.MATCH) {
      const res = await api.completeProfile(payload);
      if (!res?.ok) {
        setPageError(res?.error || "Failed to save profile.");
        return;
      }

      const updatedUser = {
        ...payload,
        ...res.user,
        profile_complete: true,
        requiresLocationConfirmation: false,
      };

      setUser(updatedUser);
      persistMockUser(updatedUser);

      //  single source of navigation
      doRedirect(updatedUser.role);
      return;
    }

    setConfirmReason(decision.reason || "UNKNOWN");
    setShowConfirm(true);
  };

  const handleConfirmLocation = async (choice) => {
    const res = await api.confirmLocation(choice);
    if (!res?.ok) {
      setPageError(res?.error || "Failed to confirm location.");
      return;
    }

    //  FIX: KP = IN_GAZA, KR = OUTSIDE
    const ensuredRole = choice === "IN_GAZA" ? ROLES.KP : ROLES.KR;

    const prof = await api.completeProfile({
      ...pendingPayload,
      role: ensuredRole,
    });

    if (!prof?.ok) {
      setPageError(prof?.error || "Failed to save profile.");
      return;
    }

    const updatedUser = {
      ...pendingPayload,
      ...prof.user,
      profile_complete: true,
      role: ensuredRole,
      requiresLocationConfirmation: false,
    };

    setUser(updatedUser);
    persistMockUser(updatedUser);

    setShowConfirm(false);

    //  single source of navigation (and clears ALL keys)
    doRedirect(ensuredRole);
  };

  return (
    <Container className="py-5" style={{ maxWidth: 980 }}>
      <h2 className="fw-bold mb-4">Your Profile</h2>

      {isProfileIncomplete ? (
        <Alert variant="danger" className="d-flex align-items-start gap-2">
          <span aria-hidden="true">🔒</span>
          <div>
            Your profile is incomplete. Please fill in the required fields to
            access protected areas.
            {missingToShow.length ? (
              <div className="mt-2">
                <Badge bg="light" text="dark">
                  Missing
                </Badge>{" "}
                <span className="ms-2 small text-muted">
                  {missingToShow.join(", ")}
                </span>
              </div>
            ) : null}
          </div>
        </Alert>
      ) : null}

      {pageError ? <Alert variant="danger">{pageError}</Alert> : null}

      <Form onSubmit={submit}>
        {/* Personal Information */}
        <Card className="mb-4 shadow-sm">
          <Card.Body className="p-4">
            <h4 className="fw-bold mb-3">Personal Information</h4>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Name</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                isInvalid={!!errors.name}
                placeholder="Your name"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="fw-semibold">City/Neighborhood</Form.Label>
              <Form.Control
                value={cityNeighborhood}
                onChange={(e) => setCityNeighborhood(e.target.value)}
                isInvalid={!!errors.city_neighborhood}
                placeholder="City, Neighborhood"
              />
              <Form.Control.Feedback type="invalid">
                {errors.city_neighborhood}
              </Form.Control.Feedback>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Role */}
        <Card className="mb-4 shadow-sm">
          <Card.Body className="p-4">
            <h4 className="fw-bold mb-3">Your Role</h4>

            <div className="d-flex">
              <Button
                type="button"
                className="flex-fill rounded-2"
                variant={selectedRole === ROLES.KP ? "primary" : "light"}
                onClick={() => setSelectedRole(ROLES.KP)}
                style={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                Knowledge Provider
              </Button>
              <Button
                type="button"
                className="flex-fill rounded-2"
                variant={selectedRole === ROLES.KR ? "primary" : "light"}
                onClick={() => setSelectedRole(ROLES.KR)}
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                Knowledge Requester
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Role Details */}
        {selectedRole === ROLES.KP ? (
          <Card className="mb-4 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Knowledge Provider Details</h4>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Crypto Wallet Type
                </Form.Label>
                <Form.Select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                  isInvalid={!!errors.wallet_type}
                >
                  <option value="">Select</option>
                  {WALLET_TYPE_OPTIONS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.wallet_type}
                </Form.Control.Feedback>
                <div className="text-muted small mt-1">
                  ℹ️ Select the blockchain platform for your wallet.
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-semibold">
                  Crypto Wallet Address
                </Form.Label>
                <Form.Control
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  isInvalid={!!errors.wallet_address}
                  placeholder="0x..."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.wallet_address}
                </Form.Control.Feedback>
                <div className="text-muted small mt-1">
                  ℹ️ Ensure this is a valid {walletType || "wallet"} address for
                  transactions.
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        ) : (
          <Card className="mb-4 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Knowledge Requester Details</h4>

              <Form.Group>
                <Form.Label className="fw-semibold">PayPal Account</Form.Label>
                <Form.Control
                  value={paypalAccount}
                  onChange={(e) => setPaypalAccount(e.target.value)}
                  isInvalid={!!errors.paypal_account}
                  placeholder="your@email.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.paypal_account}
                </Form.Control.Feedback>
              </Form.Group>
            </Card.Body>
          </Card>
        )}

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2">
          <Button type="button" variant="light" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Profile
          </Button>
        </div>
      </Form>

      <LocationConfirmationModal
        show={showConfirm}
        reason={confirmReason}
        onConfirm={handleConfirmLocation}
        onClose={() => setShowConfirm(false)}
      />
    </Container>
  );
}
