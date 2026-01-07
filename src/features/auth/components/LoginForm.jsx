import { Form, Button, Spinner } from "react-bootstrap";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  submitted,
  isEmailValid,
  isPasswordValid,
  loading,
  disabled,
  onSubmit,
  onForgot,
}) {
  const isBusy = disabled || loading;

  return (
    <Form
      onSubmit={(e) => {
        if (isBusy || loading) {
          e.preventDefault();
          return;
        }
        onSubmit?.(e);
      }}
    >
      {/* Email */}
      <Form.Label className="login-label fw-semibold">Email</Form.Label>

      <div className="login-field mb-3">
        <span className="login-field__icon" aria-hidden="true">
          <MdOutlineEmail size={18} />
        </span>

        <Form.Control
          type="email"
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={submitted && !isEmailValid}
          disabled={isBusy}
          autoComplete="email"
          inputMode="email"
          aria-invalid={isEmailValid || undefined}
          aria-describedby="login-email-feedback"
          className="login-input"
        />

        <Form.Control.Feedback type="invalid">
          Please enter a valid email address.
        </Form.Control.Feedback>
      </div>

      {/* Password */}
      <Form.Label className="login-label fw-semibold">Password</Form.Label>

      <div className="login-field mb-2">
        <span className="login-field__icon" aria-hidden="true">
          <MdOutlineLock size={18} />
        </span>

        <Form.Control
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={submitted && !isPasswordValid}
          disabled={isBusy}
          autoComplete="current-password"
          aria-invalid={isPasswordValid || undefined}
          aria-describedby="login-pass-feedback"
          className="login-input"
        />

        <Form.Control.Feedback type="invalid">
          Password must be at least 6 characters.
        </Form.Control.Feedback>
      </div>

      {/* Forgot password */}
      <div className="text-center mb-3">
        <Button
          type="button"
          variant="link"
          className="login-forgot p-0 text-decoration-none"
          onClick={onForgot}
          disabled={isBusy}
        >
          Forgot password?
        </Button>
      </div>

      {/* Sign In */}
      <Button
        type="submit"
        variant="primary"
        className="login-submit w-100 fw-semibold"
        disabled={isBusy}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" /> Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </Form>
  );
}
