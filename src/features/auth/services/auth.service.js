import { api, API_BASE_URL } from "../../../services/api";
import { canonicalizeRole } from "../context/auth.roles";

const safeWindow = () => (typeof window !== "undefined" ? window : null);

const getFullPath = () => {
  const w = safeWindow();
  if (!w) return "/";
  return `${w.location.pathname}${w.location.search}${w.location.hash}`;
};

const mapAuthResponse = (data) => {
  const rawUser = data?.user || {};
  const role = canonicalizeRole(rawUser?.role); // kp | kr | ""

  return {
    token: data?.token,
    user: {
      ...rawUser,
      role,
      profileCompleted: Boolean(
        data?.profile_completed ?? rawUser?.profile_completed ?? false
      ),
    },
    message: data?.message,
  };
};

export const login = async (credentials) => {
  const res = await api.login(credentials);
  return mapAuthResponse(res.data);
};

/** Builds OAuth URL (frontend can decide to redirect) */
export const buildOAuthRedirectUrl = (provider) => {
  const returnUrl = encodeURIComponent(getFullPath());
  return `${API_BASE_URL}/oauth/${provider}/redirect?returnUrl=${returnUrl}`;
};

/** Keep current behavior: redirect immediately */
export const loginWithGoogle = () => {
  const w = safeWindow();
  if (!w) return;
  w.location.href = buildOAuthRedirectUrl("google");
};

export const loginWithFacebook = () => {
  const w = safeWindow();
  if (!w) return;
  w.location.href = buildOAuthRedirectUrl("facebook");
};
