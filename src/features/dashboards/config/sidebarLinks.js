import { ROUTES } from "../../../constants";

/* Helpers */
const APP_BASE = ROUTES.DASH_REDIRECT || "/app";
const APP_REQUESTS = `${APP_BASE}/requests`;

/* Sidebar Links by Role */
export const sidebarLinksByRole = {
  requester: [
    { to: ROUTES.DASH_KR, label: "Requester Dashboard" },
    { to: APP_REQUESTS, label: "Public Requests" },
    { to: ROUTES.PROFILE, label: "Profile" },
    { to: ROUTES.KRS, label: "My KRs" },
    { to: ROUTES.NOTIFICATIONS, label: "Notifications" },
  ],

  kp: [
    { to: ROUTES.DASH_KP, label: "KP Dashboard" },
    { to: APP_REQUESTS, label: "Public Requests" },
    { to: ROUTES.PROFILE, label: "Profile" },
    { to: ROUTES.KRS, label: "Assigned KRs" },
    { to: ROUTES.NOTIFICATIONS, label: "Notifications" },
  ],

  admin: [
    { to: ROUTES.DASH_ADMIN, label: "Admin Dashboard" },
    { to: APP_REQUESTS, label: "Public Requests" },
    { to: ROUTES.KRS, label: "All KRs" },
    { to: ROUTES.NOTIFICATIONS, label: "Notifications" },
  ],
};
