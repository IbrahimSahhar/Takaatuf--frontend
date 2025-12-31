import { useCallback } from "react";
import { getProviderIdentity, mockNetwork } from "../services/authMock.service";

export default function useProviderLogin({
  isBusy,
  authenticate,
  resetUI,
  showMessage,
  setLoadingProvider,
}) {
  return useCallback(
    async (provider) => {
      if (isBusy) return;

      resetUI();
      setLoadingProvider(provider);

      try {
        await mockNetwork(700);
        await authenticate(getProviderIdentity(provider));
      } catch (err) {
        // Cancel case
        if (err?.code === "CANCELLED" || err?.message === "CANCELLED") {
          showMessage("info", "Login was cancelled. Please try again.");
        } else {
          showMessage(
            "danger",
            "Provider authentication failed. Please try again."
          );
        }
      } finally {
        setLoadingProvider(null);
      }
    },
    [isBusy, authenticate, resetUI, showMessage, setLoadingProvider]
  );
}
