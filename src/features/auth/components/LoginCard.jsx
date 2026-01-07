import { Card, Alert } from "react-bootstrap";
import OAuthButtons from "./OAuthButtons";
import LoginForm from "./LoginForm";
import useLoginLogic from "../hooks/useLoginLogic";

/*
 LoginCard is a presentational container for the login flow.
 It orchestrates UI components while delegating all business logic and state management to the useLoginLogic hook.
*/
export default function LoginCard() {
  /*
   Login state and handlers provided by a dedicated hook.
   This keeps the component focused on rendering only.
  */
  const {
    email,
    password,
    loadingProvider,
    loadingEmail,
    status,
    submitted,
    isEmailValid,
    isPasswordValid,
    isBusy,
    setEmail,
    setPassword,
    showMessage,
    handleProvider,
    handleEmailLogin,
  } = useLoginLogic();

  const handleForgot = () =>
    showMessage("info", "Password reset is not implemented yet.");

  return (
    <Card className="border-0 login-card">
      <Card.Body className="p-4">
        {/* Header */}
        <div className="mb-4 text-center">
          <h3 className="fw-bold mb-1" style={{ letterSpacing: ".2px" }}>
            Sign In to TAKAATUF
          </h3>
          <div className="text-muted" style={{ fontSize: 14 }}>
            Securely access your account
          </div>
        </div>

        {/* Status */}
        {status?.msg && (
          <Alert
            variant={status.type}
            className="py-2 small"
            role="alert"
            aria-live="polite"
            style={{ borderRadius: 12 }}
          >
            {status.msg}
          </Alert>
        )}

        {/* OAuth */}
        <OAuthButtons
          onProvider={handleProvider}
          loadingProvider={loadingProvider}
          disabled={isBusy}
        />

        {/* Divider */}
        <div className="d-flex align-items-center gap-3 my-4">
          <div className="flex-grow-1 border-top" />
          <span
            className="text-uppercase text-muted"
            style={{ fontSize: 12, letterSpacing: ".08em" }}
          >
            OR CONTINUE WITH
          </span>
          <div className="flex-grow-1 border-top" />
        </div>

        {/* Email form */}
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          submitted={submitted}
          isEmailValid={isEmailValid}
          isPasswordValid={isPasswordValid}
          loading={loadingEmail}
          disabled={isBusy}
          onSubmit={handleEmailLogin}
          onForgot={handleForgot}
        />

        <div
          className="text-muted mt-4"
          style={{ fontSize: 12, lineHeight: 1.45 }}
        >
          By signing in, you agree to our terms. We only request minimum
          provider scopes for authentication. Your session will last 1 year or
          until you logout.
        </div>
      </Card.Body>
    </Card>
  );
}
