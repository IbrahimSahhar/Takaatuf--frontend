import { lazy } from "react";

const L = (importer) => lazy(importer);

export const P = {
  // Public
  PublicRequestsPage: L(() => import("../pages/public/PublicRequestsPage")),
  PublicRequestDetailsPage: L(() =>
    import("../pages/public/PublicRequestDetailsPage")
  ),

  // Auth
  LoginPage: L(() => import("../features/auth/pages/LoginPage")),
  CompleteProfilePage: L(() =>
    import("../features/profile/pages/CompleteProfilePage")
  ),

  // Dashboards
  RequesterDashboardPage: L(() =>
    import("../features/dashboards/requester/RequesterDashboardPage")
  ),
  KPDashboardPage: L(() => import("../features/dashboards/kp/KPDashboardPage")),
  AdminDashboardPage: L(() =>
    import("../features/dashboards/admin/AdminDashboardPage")
  ),

  // Shared
  ProfilePage: L(() => import("../features/profile/pages/ProfilePage")),
  KRListPage: L(() => import("../features/krs/pages/KRListPage")),
  NotificationsPage: L(() =>
    import("../features/notifications/pages/NotificationsPage")
  ),

  // System
  ForbiddenPage: L(() => import("../pages/common/ForbiddenPage")),
  NotFoundPage: L(() => import("../pages/common/NotFoundPage")),
};
