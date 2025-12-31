export const mockApi = {
  /*
   Contract:
   completeProfile(payload) -> { ok: boolean, user?: object, error?: string }
   */
  async completeProfile(payload) {
    await wait(250);

    // mock success
    return {
      ok: true,
      user: {
        ...payload,
        profile_complete: true,
      },
    };
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
