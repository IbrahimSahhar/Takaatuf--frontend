/* Storage keys */
const USERS_KEY = "takaatuf_users";
const CURRENT_USER_KEY = "takaatuf_current_user";

export const mockApi = {
  /*
    Contract:
    completeProfile(payload) -> { ok: boolean, user?: object, error?: string }
  */
  async completeProfile(payload) {
    await wait(250);

    try {
      // Load users store
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");

      // Determine user key (provider:email or fallback)
      const key = payload?.email
        ? `${payload.provider || "email"}:${payload.email}`
        : CURRENT_USER_KEY;

      const existing = users[key] || {};

      const updatedUser = {
        ...existing,
        ...payload,
        profile_complete: true,
      };

      // Persist
      users[key] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, key);

      return {
        ok: true,
        user: updatedUser,
      };
    } catch (e) {
      return {
        ok: false,
        error: "Failed to save profile (mock).",
      };
    }
  },

  /*
    Contract:
    confirmLocation(choice) -> { ok: boolean, error?: string }
  */
  async confirmLocation(choice) {
    await wait(200);

    if (!choice) {
      return { ok: false, error: "Missing choice" };
    }

    return { ok: true };
  },
};

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
