import { Button, Spinner } from "react-bootstrap";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", icon: FaGoogle },
  { id: "facebook", label: "Continue with Facebook", icon: FaFacebookF },
];

export default function OAuthButtons({
  onProvider,
  loadingProvider,
  disabled,
}) {
  return (
    <div className="d-grid gap-2">
      {PROVIDERS.map(({ id, label, icon: Icon }) => {
        const isLoading = loadingProvider === id;
        return (
          <Button
            key={id}
            variant="outline-dark"
            className="d-flex align-items-center justify-content-center gap-2"
            onClick={() => onProvider(id)}
            disabled={disabled}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" /> Signing in...
              </>
            ) : (
              <>
                <Icon /> {label}
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
}
