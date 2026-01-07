import { canonicalizeRole } from "./auth.roles";
import { get, isNonEmpty } from "./auth.utils";

export const LS_PROFILE_COMPLETE_KEY = "profile_complete_mock";

/* Wallet validation (KP only) */
export const validateWalletAddress = (type, address) => {
  const t = String(type || "").toLowerCase();
  const a = String(address || "").trim();

  if (!a) return false;

  if (t === "ethereum") return /^0x[a-fA-F0-9]{40}$/.test(a);

  if (t === "bitcoin")
    return (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(a) ||
      /^bc1[ac-hj-np-z02-9]{25,90}$/.test(a)
    );

  if (t === "solana") return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a);

  return true;
};

/* Missing fields logic */
export const computeMissingProfileFields = (u) => {
  const missing = [];

  const name = get(u, "name", "fullName", "full_name");
  const city = get(
    u,
    "city",
    "neighborhood",
    "cityNeighborhood",
    "city_neighborhood"
  );

  if (!isNonEmpty(name)) missing.push("name");
  if (!isNonEmpty(city)) missing.push("city_neighborhood");

  const role = canonicalizeRole(get(u, "role"));
  if (!role) missing.push("role");

  // Role-based requirements
  if (role === "kp") {
    const walletType = get(
      u,
      "walletType",
      "wallet_type",
      "cryptoWalletType",
      "crypto_wallet_type"
    );
    const walletAddress = get(
      u,
      "walletAddress",
      "wallet_address",
      "cryptoWalletAddress",
      "crypto_wallet_address"
    );

    if (!isNonEmpty(walletType)) missing.push("wallet_type");
    if (!isNonEmpty(walletAddress)) missing.push("wallet_address");

    if (isNonEmpty(walletType) && isNonEmpty(walletAddress)) {
      if (!validateWalletAddress(walletType, walletAddress)) {
        missing.push("wallet_address_invalid");
      }
    }
  }

  if (role === "kr") {
    const paypal = get(
      u,
      "paypalAccount",
      "paypal_account",
      "paypalEmail",
      "paypal_email"
    );
    if (!isNonEmpty(paypal)) missing.push("paypal_account");
  }

  return missing;
};

/*
  Compute profile_complete
  Priority:
  1) backend boolean flag if present
  2) localStorage mock flag if present (dev/testing)
  3) infer from missing fields
 */
export const computeProfileComplete = (u) => {
  const backendFlag = get(
    u,
    "profile_complete",
    "profileComplete",
    "profile_completed"
  );
  if (typeof backendFlag === "boolean") return backendFlag;

  const ls = localStorage.getItem(LS_PROFILE_COMPLETE_KEY);
  if (ls === "true" || ls === "false") return ls === "true";

  const missing = computeMissingProfileFields(u);
  return missing.length === 0;
};
