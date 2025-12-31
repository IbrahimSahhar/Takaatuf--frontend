import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { ROUTES } from "../constants";

/* Lazy Loader */
import RouteLoader from "../components/common/RouteLoader";

/* Route groups */
import { publicRoutes } from "../routes/public.routes";
import { authRoutes } from "../routes/auth.routes";
import { dashboardRoutes } from "../routes/dashboard.routes";
import { systemRoutes } from "../routes/system.routes";

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.PUBLIC_REQUESTS} replace />}
        />

        {/* Public */}
        {publicRoutes()}

        {/* Auth */}
        {authRoutes()}

        {/* Protected App */}
        {dashboardRoutes()}

        {/* System */}
        {systemRoutes()}
      </Routes>
    </Suspense>
  );
}
