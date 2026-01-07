import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import {
  REDIRECT_KEY,
  mapPublicToDashboard,
  roleHome,
} from "../utils/authRedirect";
import api from "@/services/api";

const readRedirect = () => {
  try {
    const next = localStorage.getItem(REDIRECT_KEY);
    localStorage.removeItem(REDIRECT_KEY);
    return next;
  } catch {
    return null;
  }
};

const parseBoolParam = (value) => value === "true" || value === "1";

const safeInternalPath = (value, fallback = "/") => {
  if (!value) return fallback;
  // allow only internal paths to prevent open redirect
  return typeof value === "string" && value.startsWith("/") ? value : fallback;
};

const pickProfileCompleted = ({ user, profileCompletedFromQuery }) => {
  // backend may send: profileCompleted / profile_completed
  const fromUser = user?.profileCompleted ?? user?.profile_completed;

  if (typeof fromUser === "boolean") return fromUser;

  // fallback: query param (true/false/1/0)
  if (typeof profileCompletedFromQuery === "boolean")
    return profileCompletedFromQuery;

  // default: treat as completed to avoid forcing users incorrectly
  return true;
};

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const token = params.get("token");
      const returnUrlRaw = params.get("returnUrl") || "/";
      const profileCompletedParam = params.get("profile_completed");

      const profileCompletedFromQuery =
        profileCompletedParam == null
          ? undefined
          : parseBoolParam(profileCompletedParam);

      if (!token) {
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      try {
        // Store token early so /profile uses Authorization header
        localStorage.setItem("token", token);

        const res = await api.get("/profile");
        const user = res.data?.user ?? res.data ?? {};

        const profileCompleted = pickProfileCompleted({
          user,
          profileCompletedFromQuery,
        });

        const normalizedUser = {
          ...user,
          role: user?.role ?? "user",
          profileCompleted,
        };

        login({ token, user: normalizedUser });

        if (cancelled) return;

        const saved = readRedirect();
        const mapped = saved ? mapPublicToDashboard(saved) : null;

        const safeReturnUrl = safeInternalPath(returnUrlRaw, "/");

        const finalTarget = !profileCompleted
          ? ROUTES.COMPLETE_PROFILE
          : mapped || safeReturnUrl || roleHome(normalizedUser.role);

        navigate(finalTarget, { replace: true });
      } catch {
        // cleanup token if profile request fails (avoids broken session)
        try {
          localStorage.removeItem("token");
        } catch {}

        if (!cancelled) navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [params, navigate, login]);

  return null;
}
