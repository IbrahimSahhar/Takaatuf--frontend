export const ROUTES = Object.freeze({
  /* Public routes */
  HOME: "/",
  PUBLIC_REQUESTS: "/requests",

  /* Authentication routes */
  LOGIN: "/login",
  COMPLETE_PROFILE: "/complete-profile",
  CONFIRM_LOCATION: "/confirm-location",

  /* Shared authenticated routes inside /app */
  DASH_REDIRECT: "/app",

  // Authenticated requests (the mapped destination)
  APP_REQUESTS: "/app/requests",
  APP_REQUEST_DETAILS: "/app/requests/:id",

  /* Other shared routes */
  PROFILE: "/app/profile",
  NOTIFICATIONS: "/app/notifications",
  KRS: "/app/krs",

  /* Dashboard entry points by role */
  DASH_KR: "/app/dashboard/requester",
  DASH_KP: "/app/dashboard/kp",
  DASH_ADMIN: "/app/dashboard/admin",

  /* System routes */
  FORBIDDEN: "/403",
  NOT_FOUND: "*",
});
