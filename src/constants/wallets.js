export const WALLET_TYPES = Object.freeze({
  ETHEREUM: "ethereum",
  SOLANA: "solana",
  BITCOIN: "bitcoin",
});

export const WALLET_TYPE_OPTIONS = [
  {
    value: WALLET_TYPES.ETHEREUM,
    label: "Ethereum",
  },
  {
    value: WALLET_TYPES.SOLANA,
    label: "Solana",
  },
  {
    value: WALLET_TYPES.BITCOIN,
    label: "Bitcoin",
  },
];
