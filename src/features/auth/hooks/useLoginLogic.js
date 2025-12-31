import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../../../constants/roles";

import {
  REDIRECT_KEY,
  mapPublicToDashboard,
  roleHome,
} from "../utils/authRedirect";

import { getOrCreateUser } from "../services/authMock.service";

import { isValidEmail, isValidPassword } from "../utils/validators";

import useProviderLogin from "./useProviderLogin";
import useEmailLogin from "../hooks/useEmailLogin";

const emptyStatus = { type: "", msg: "" };

export default function useLoginLogic() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingProvider, setLoadingProvider] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [status, setStatus] = useState(emptyStatus);
  const [submitted, setSubmitted] = useState(false);

  const showMessage = useCallback((type, msg) => setStatus({ type, msg }), []);

  const isEmailValid = useMemo(() => isValidEmail(email), [email]);
  const isPasswordValid = useMemo(() => isValidPassword(password), [password]);

  const isBusy = Boolean(loadingProvider) || loadingEmail;

  const goNext = useCallback(
    (fallbackRole = ROLES.REQUESTER) => {
      const next = localStorage.getItem(REDIRECT_KEY);
      localStorage.removeItem(REDIRECT_KEY);

      const mapped = next ? mapPublicToDashboard(next) : null;
      navigate(mapped || roleHome(fallbackRole));
    },
    [navigate]
  );

  const authenticate = useCallback(
    async ({ provider, email }) => {
      const user = getOrCreateUser({ provider, email });
      login({ token: "fake-token", user });
      goNext(user.role);
    },
    [login, goNext]
  );

  const resetUI = useCallback(() => {
    setSubmitted(false);
    setStatus(emptyStatus);
  }, []);

  const handleProvider = useProviderLogin({
    isBusy,
    authenticate,
    resetUI,
    showMessage,
    setLoadingProvider,
  });

  const handleEmailLogin = useEmailLogin({
    isBusy,
    email,
    password,
    authenticate,
    showMessage,
    setSubmitted,
    setStatus,
    setLoadingEmail,
  });

  return {
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
  };
}
