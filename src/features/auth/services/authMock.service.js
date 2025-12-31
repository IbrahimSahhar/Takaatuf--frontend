import { loadUsers, saveUsers } from "../utils/authStorage";
import { consumeRedirect } from "../utils/authRedirect";
import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";

/*
 Mock Provider Identity
 - google / facebook: normal behavior
 - cancel: for testing (throws an error with code CANCELLED)
 */
export function getProviderIdentity(provider) {
  // Mock cancel support (useful for AC testing)
  if (provider === "cancel") {
    const err = new Error("CANCELLED");
    err.code = "CANCELLED";
    throw err;
  }

  if (provider === "google")
    return { provider: "google", email: "user@gmail.com" };

  if (provider === "facebook")
    return { provider: "facebook", email: "user@facebook.com" };

  // fallback (in case a provider id is unknown)
  return { provider: String(provider), email: "user@unknown.com" };
}

export function getOrCreateUser({ provider, email }) {
  const users = loadUsers();
  const key = `${provider}:${email}`;

  if (users[key]) return users[key];

  const next = consumeRedirect() || "";
  let role = ROLES.REQUESTER;
  if (next.startsWith(ROUTES.DASH_ADMIN)) role = ROLES.ADMIN;
  if (next.startsWith(ROUTES.DASH_KP)) role = ROLES.KP;

  const newUser = {
    id: Date.now(),
    name:
      provider === "google"
        ? "Google User"
        : provider === "facebook"
        ? "Facebook User"
        : "Email User",
    email,
    provider,
    role,
    profile_complete: false, // ensures new user must complete profile
  };

  users[key] = newUser;
  saveUsers(users);
  return newUser;
}

export async function mockNetwork(ms = 500) {
  await new Promise((r) => setTimeout(r, ms));
}
