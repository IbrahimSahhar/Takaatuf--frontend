import { useCallback } from "react";
import { validateLogin } from "../utils/loginValidation";
import { mockNetwork } from "../services/authMock.service";

const emptyStatus = { type: "", msg: "" };

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
  return useCallback(
    async (e) => {
      e.preventDefault();
      if (isBusy) return;

      setSubmitted(true);
      setStatus(emptyStatus);

      const err = validateLogin({ email, password });
      if (err) {
        showMessage("danger", err);
        return;
      }

      setLoadingEmail(true);
      try {
        await mockNetwork(400);
        await authenticate({ provider: "email", email: email.trim() });
      } catch {
        showMessage("danger", "Email login failed. Please try again.");
      } finally {
        setLoadingEmail(false);
      }
    },
    [
      isBusy,
      email,
      password,
      authenticate,
      showMessage,
      setSubmitted,
      setStatus,
      setLoadingEmail,
    ]
  );
}
