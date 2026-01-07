import { loadUsers, saveUsers } from "../utils/authStorage";
import { peekRedirect } from "../utils/authRedirect";
import { ROUTES } from "../../../constants/routes";
import { ROLES } from "../../../constants/roles";

const PROVIDER_EMAILS = {
  google: "user@gmail.com",
  facebook: "user@facebook.com",
};

export function getProviderIdentity(provider) {
  const p = String(provider || "")
    .toLowerCase()
    .trim();

  if (p === "cancel") {
    const err = new Error("CANCELLED");
    err.code = "CANCELLED";
    throw err;
  }

  return {
    provider: p,
    email: PROVIDER_EMAILS[p] || "user@unknown.com",
  };
}

/** remove query/hash to make route checks stable */
const normalizePath = (url = "") => String(url).split(/[?#]/)[0];

const deriveRoleFromNext = (next) => {
  const path = normalizePath(next);

  if (path.startsWith(ROUTES.DASH_ADMIN)) return ROLES.ADMIN;
  if (path.startsWith(ROUTES.DASH_KP)) return ROLES.KP;

  return ROLES.KR;
};

export function getOrCreateUser({ provider, email }) {
  const users = loadUsers();
  const key = `${provider}:${email}`;

  if (users[key]) return users[key];

  const next = peekRedirect() || "";
  const role = deriveRoleFromNext(next);

  const newUser = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name:
      provider === "google"
        ? "Google User"
        : provider === "facebook"
        ? "Facebook User"
        : "Email User",
    email,
    provider,
    role,
    profileCompleted: false,
  };

  users[key] = newUser;
  saveUsers(users);
  return newUser;
}

export async function mockNetwork(ms = 500) {
  await new Promise((r) => setTimeout(r, ms));
}
