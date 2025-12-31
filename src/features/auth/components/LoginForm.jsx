import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { MdEmail, MdLockOutline } from "react-icons/md";

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
  return (
    <Form onSubmit={onSubmit}>
      <Form.Label className="fw-semibold">Email</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <MdEmail />
        </InputGroup.Text>
        <Form.Control
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={submitted && !isEmailValid}
          disabled={disabled}
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid email address.
        </Form.Control.Feedback>
      </InputGroup>

      <Form.Label className="fw-semibold">Password</Form.Label>
      <InputGroup className="mb-2">
        <InputGroup.Text>
          <MdLockOutline />
        </InputGroup.Text>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={submitted && !isPasswordValid}
          disabled={disabled}
        />
        <Form.Control.Feedback type="invalid">
          Password must be at least 6 characters.
        </Form.Control.Feedback>
      </InputGroup>

      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="link"
          className="p-0 text-decoration-none"
          onClick={onForgot}
          disabled={disabled}
        >
          Forgot password?
        </Button>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-100 py-2"
        disabled={disabled}
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
