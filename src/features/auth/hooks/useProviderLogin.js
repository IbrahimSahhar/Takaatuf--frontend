import { useCallback } from "react";
import { getProviderIdentity, mockNetwork } from "../services/authMock.service";

const isCancelledError = (err) =>
  err?.code === "CANCELLED" || err?.message === "CANCELLED";

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

        const identity = getProviderIdentity(provider);
        await authenticate(identity);
      } catch (err) {
        if (isCancelledError(err)) {
          showMessage("info", "Login was cancelled. Please try again.");
          return;
        }

        showMessage(
          "danger",
          "Provider authentication failed. Please try again."
        );
      } finally {
        setLoadingProvider(null);
      }
    },
    [isBusy, authenticate, resetUI, showMessage, setLoadingProvider]
  );
}
