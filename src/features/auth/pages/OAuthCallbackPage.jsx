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

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const run = async () => {
      const token = params.get("token");
      const returnUrl = params.get("returnUrl") || "/";
      const profileCompletedParam = params.get("profile_completed");

      const profileCompleted =
        profileCompletedParam === "true" || profileCompletedParam === "1";

      if (!token) {
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      try {
        localStorage.setItem("token", token);

        const res = await api.get("/profile");
        const user = res.data?.user ?? res.data;

        login({
          token,
          user: {
            ...user,
            role: user?.role ?? "user",
            profileCompleted: Boolean(
              user?.profileCompleted ??
                user?.profile_completed ??
                profileCompleted
            ),
          },
        });

        // Redirect logic
        const saved = readRedirect();
        const mapped = saved ? mapPublicToDashboard(saved) : null;

        const finalTarget =
          user?.profile_completed === false || profileCompleted === false
            ? ROUTES.COMPLETE_PROFILE
            : mapped || returnUrl || roleHome(user?.role ?? "user");

        navigate(finalTarget, { replace: true });
      } catch {
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    run();
  }, [params, navigate, login]);

  return null;
}
