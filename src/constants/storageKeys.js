export const STORAGE_KEYS = Object.freeze({
  /* 
   Stores the short-lived access token used for authenticated API requests.
  */
  ACCESS_TOKEN: "access_token",

  /* 
   Stores the refresh token used to obtain a new access token when the current one expires.
  */
  REFRESH_TOKEN: "refresh_token",

  /* 
   Stores the serialized authenticated user object.
  */
  USER: "user",
});

/* 
 Legacy / feature-specific storage keys.
 These are used outside the core auth token storage and may be consolidated in the future.
*/
export const USERS_KEY = "takaatuf_users";
export const AUTH_KEY = "takaatuf_auth";

/* 
 Used to persist the user's intended destination before authentication, enabling post-login redirects.
*/
export const REDIRECT_KEY = "redirect_after_login";
