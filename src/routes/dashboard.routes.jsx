import { Route } from "react-router-dom";
import { ROUTES } from "../constants";

/* Layouts */
import DashboardLayout from "../layouts/DashboardLayout";

/* Guards */
import RequireAuth from "../features/auth/guards/RequireAuth";
import RequireRole from "../features/auth/guards/RequireRole";
import RequireProfileComplete from "../features/auth/guards/RequireProfileComplete";
import RequireLocationConfirmed from "../features/auth/guards/RequireLocationConfirmed";

/* Lazy Pages */
import { P } from "./lazyPages";

/* Helpers */
const APP_REQUESTS = `${ROUTES.DASH_REDIRECT}/requests`;
const APP_REQUEST_DETAILS = `${ROUTES.DASH_REDIRECT}/requests/:id`;

export const dashboardRoutes = () => {
  const roleDashboards = [
    {
      path: ROUTES.DASH_REQUESTER,
      role: "requester",
      element: <P.RequesterDashboardPage />,
    },
    { path: ROUTES.DASH_KP, role: "kp", element: <P.KPDashboardPage /> },
    {
      path: ROUTES.DASH_ADMIN,
      role: "admin",
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
      {roleDashboards.map((r) => (
        <Route
          key={r.path}
          path={r.path}
          element={<RequireRole allow={[r.role]}>{r.element}</RequireRole>}
        />
      ))}

      {/* Requests (inside dashboard) */}
      <Route path={APP_REQUESTS} element={<P.PublicRequestsPage />} />
      <Route
        path={APP_REQUEST_DETAILS}
        element={<P.PublicRequestDetailsPage />}
      />

      {/* Shared */}
      {sharedRoutes.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
    </Route>
  );
};
