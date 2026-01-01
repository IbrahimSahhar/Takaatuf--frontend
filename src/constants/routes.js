export const ROUTES = Object.freeze({
  // Public
  HOME: "/",
  PUBLIC_REQUESTS: "/requests",

  // Auth
  LOGIN: "/login",
  COMPLETE_PROFILE: "/complete-profile",
  CONFIRM_LOCATION: "/confirm-location",

  // Shared (inside dashboard)
  PROFILE: "/app/profile",
  NOTIFICATIONS: "/app/notifications",
  KRS: "/app/krs",

  // Dashboards
  DASH_REDIRECT: "/app",
  DASH_REQUESTER: "/app/dashboard/requester",
  DASH_KP: "/app/dashboard/kp",
  DASH_ADMIN: "/app/dashboard/admin",

  DASH_KR: "/app/dashboard/requester",

  // System
  FORBIDDEN: "/403",
  NOT_FOUND: "*",
});
