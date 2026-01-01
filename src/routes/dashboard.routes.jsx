import { Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { ROLES } from "../constants/roles";

/* Layouts */
import DashboardLayout from "../layouts/DashboardLayout";

/* Guards */
import RequireAuth from "../features/auth/guards/RequireAuth";
import RequireRole from "../features/auth/guards/RequireRole";
import RequireProfileComplete from "../features/auth/guards/RequireProfileComplete";
import RequireLocationConfirmed from "../features/auth/guards/RequireLocationConfirmed";

/* Auth */
import { useAuth } from "../features/auth/context/AuthContext";

/* Lazy Pages */
import { P } from "./lazyPages";

/* Helpers */
const APP_REQUESTS = `${ROUTES.DASH_REDIRECT}/requests`;
const APP_REQUEST_DETAILS = `${ROUTES.DASH_REDIRECT}/requests/:id`;

function AppIndexRedirect() {
  const { role } = useAuth();

  const to =
    role === ROLES.ADMIN
      ? ROUTES.DASH_ADMIN
      : role === ROLES.KP
      ? ROUTES.DASH_KP
      : ROUTES.DASH_REQUESTER; //  KR (Outside Gaza)

  return <Navigate to={to} replace />;
}

export const dashboardRoutes = () => {
  const roleDashboards = [
    {
      path: ROUTES.DASH_REQUESTER,
      //  requester dashboard should allow KR (canonical) and REQUESTER (legacy)
      allow: [ROLES.KR, ROLES.REQUESTER],
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
      {/* app should always land on the correct dashboard */}
      <Route path={ROUTES.DASH_REDIRECT} element={<AppIndexRedirect />} />

      {roleDashboards.map((r) => (
        <Route
          key={r.path}
          path={r.path}
          element={<RequireRole allow={r.allow}>{r.element}</RequireRole>}
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
