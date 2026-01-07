import { Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { ROLES } from "../constants/roles";

/* Layout */
import DashboardLayout from "../layouts/DashboardLayout";

/* Guards */
import RequireAuth from "../features/auth/guards/RequireAuth";
import RequireRole from "../features/auth/guards/RequireRole";
import RequireProfileComplete from "../features/auth/guards/RequireProfileComplete";
import RequireLocationConfirmed from "../features/auth/guards/RequireLocationConfirmed";

/* Lazy Pages */
import { P } from "./lazyPages";

/*
  AppIndexRedirect
  - When a user opens "/app" we want a predictable landing.
  - Based on your requirement: land on "/app/requests" (NOT role dashboards).
 */
function AppIndexRedirect() {
  return <Navigate to={ROUTES.APP_REQUESTS} replace />;
}

export const dashboardRoutes = () => {
  const roleDashboards = [
    {
      path: ROUTES.DASH_KR,
      allow: [ROLES.KR],
      element: <P.RequesterDashboardPage />,
    },
    {
      path: ROUTES.DASH_KP,
      allow: [ROLES.KP],
      element: <P.KPDashboardPage />,
    },
    {
      path: ROUTES.DASH_ADMIN,
      allow: [ROLES.ADMIN],
      element: <P.AdminDashboardPage />,
    },
  ];

  const sharedRoutes = [
    { path: ROUTES.PROFILE, element: <P.ProfilePage /> },
    { path: ROUTES.KRS, element: <P.KRListPage /> },
    { path: ROUTES.NOTIFICATIONS, element: <P.NotificationsPage /> },
  ];

  return (
    <Route
      element={
        <RequireAuth>
          <RequireProfileComplete>
            <RequireLocationConfirmed>
              <DashboardLayout />
            </RequireLocationConfirmed>
          </RequireProfileComplete>
        </RequireAuth>
      }
    >
      {/* When opening "/app" -> land on "/app/requests" */}
      <Route path={ROUTES.DASH_REDIRECT} element={<AppIndexRedirect />} />

      {/* Role dashboards (still accessible by direct URL) */}
      {roleDashboards.map((r) => (
        <Route
          key={r.path}
          path={r.path}
          element={<RequireRole allow={r.allow}>{r.element}</RequireRole>}
        />
      ))}

      {/* Requests (inside /app) */}
      <Route path={ROUTES.APP_REQUESTS} element={<P.PublicRequestsPage />} />
      <Route
        path={ROUTES.APP_REQUEST_DETAILS}
        element={<P.PublicRequestDetailsPage />}
      />

      {/* Shared */}
      {sharedRoutes.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
    </Route>
  );
};
