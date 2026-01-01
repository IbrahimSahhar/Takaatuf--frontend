import api from "../../../services/api/index";

const mapAuthResponse = (data) => ({
  token: data.token,
  user: {
    ...data.user,
    role: data.user.role ?? "user",
    profileCompleted:
      data.profile_completed ?? data.user.profile_completed ?? false,
  },
  returnUrl: data.returnUrl,
  message: data.message,
});

/* Helpers */
const fullPath = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

export const login = async (credentials) => {
  const res = await api.post("/login", credentials);
  return mapAuthResponse(res.data);
};

export const loginWithGoogle = () => {
  const returnUrl = encodeURIComponent(fullPath());
  window.location.href = `${api.defaults.baseURL}/oauth/google/redirect?returnUrl=${returnUrl}`;
};

export const loginWithFacebook = () => {
  const returnUrl = encodeURIComponent(fullPath());
  window.location.href = `${api.defaults.baseURL}/oauth/facebook/redirect?returnUrl=${returnUrl}`;
};
