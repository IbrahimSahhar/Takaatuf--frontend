import { Card, Alert } from "react-bootstrap";
import OAuthButtons from "./OAuthButtons";
import LoginForm from "./LoginForm";
import useLoginLogic from "../hooks/useLoginLogic";

export default function LoginCard() {
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

  return (
    <Card
      className="shadow-sm border-0"
      style={{ maxWidth: 520, width: "100%" }}
    >
      <Card.Body className="p-4 p-md-5">
        <div className="mb-4 text-center">
          <h3 className="fw-bold mb-1">Sign In to TAKAATUF</h3>
          <div className="text-muted">Securely access your account</div>
        </div>

        {status.msg && (
          <Alert variant={status.type} className="py-2">
            {status.msg}
          </Alert>
        )}

        <OAuthButtons
          onProvider={handleProvider}
          loadingProvider={loadingProvider}
          disabled={isBusy}
        />

        <div className="d-flex align-items-center my-4">
          <div className="flex-grow-1 border-top" />
          <span className="mx-2 text-muted small">OR CONTINUE WITH</span>
          <div className="flex-grow-1 border-top" />
        </div>

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
          onForgot={() =>
            showMessage("info", "Password reset is not implemented yet.")
          }
        />

        <div className="text-center mt-4 small text-muted">
          By continuing, you agree to our Terms & Privacy Policy.
        </div>
      </Card.Body>
    </Card>
  );
}
