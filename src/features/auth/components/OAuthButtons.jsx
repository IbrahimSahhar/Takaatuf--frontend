import { Button, Spinner } from "react-bootstrap";
import { OAUTH_PROVIDERS } from "../../../constants/oauthProviders";

const toSignInLabel = (label = "") =>
  label
    .replace(/^continue with\s+/i, "Sign in with ")
    .replace(/^sign in with\s+/i, "Sign in with ");

export default function OAuthButtons({
  onProvider,
  loadingProvider,
  disabled,
}) {
  return (
    <div className="d-grid gap-3">
      {OAUTH_PROVIDERS.map(({ id, label, icon: Icon }) => {
        const isLoading = loadingProvider === id;
        const uiLabel = toSignInLabel(label);

        return (
          <Button
            key={id}
            variant="outline-secondary"
            className="oauth-btn d-flex align-items-center justify-content-center gap-2 fw-semibold"
            onClick={() => {
              if (disabled || isLoading) return;
              onProvider(id);
            }}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                <span className="oauth-btn__text">Signing in...</span>
              </>
            ) : (
              <>
                <Icon />
                <span className="oauth-btn__text">{uiLabel}</span>
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
}
