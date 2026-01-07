/* 
 Centralized definition of supported wallet types.
 Used to keep wallet identifiers consistent across validation, storage, and API payloads.
*/
export const WALLET_TYPES = Object.freeze({
  /* 
   Ethereum-based wallet identifier.
  */
  ETHEREUM: "ethereum",

  /* 
   Solana-based wallet identifier.
  */
  SOLANA: "solana",

  /* 
   Bitcoin wallet identifier.
  */
  BITCOIN: "bitcoin",
});

/* 
 UI-friendly wallet type options.
 Used primarily in forms and selectors where a value/label structure is required.
*/
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
