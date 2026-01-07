import { useCallback } from "react";
import { validateLogin } from "../utils/loginValidation";
import { mockNetwork } from "../services/authMock.service";

const EMPTY_STATUS = { type: "", msg: "" };

export default function useEmailLogin({
  isBusy,
  email,
  password,
  authenticate,
  showMessage,
  setSubmitted,
  setStatus,
  setLoadingEmail,
}) {
  const handleError = (message) => {
    showMessage("danger", message);
  };

  return useCallback(
    async (e) => {
      e.preventDefault();
      if (isBusy) return;

      setSubmitted(true);
      setStatus(EMPTY_STATUS);

      const validationError = validateLogin({ email, password });
      if (validationError) {
        handleError(validationError);
        return;
      }

      setLoadingEmail(true);

      try {
        await mockNetwork(400);
        await authenticate({
          provider: "email",
          email: email.trim(),
        });
      } catch (error) {
        handleError("Email login failed. Please try again.");
      } finally {
        setLoadingEmail(false);
      }
    },
    [
      isBusy,
      email,
      password,
      authenticate,
      setSubmitted,
      setStatus,
      setLoadingEmail,
    ]
  );
}
