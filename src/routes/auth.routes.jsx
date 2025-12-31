import { Route } from "react-router-dom";
import { ROUTES } from "../constants";

/* Layout */
import AuthLayout from "../layouts/AuthLayout";

/* Guards */
import RequireAuth from "../features/auth/guards/RequireAuth";
import RequireProfileIncomplete from "../features/auth/guards/RequireProfileIncomplete";
import RedirectIfAuth from "../features/auth/guards/RedirectIfAuth";

/* Pages */
import { P } from "./lazyPages";

export const authRoutes = () => (
  <Route element={<AuthLayout />}>
    {/* Login */}
    <Route
      path={ROUTES.LOGIN}
      element={
        <RedirectIfAuth>
          <P.LoginPage />
        </RedirectIfAuth>
      }
    />

    {/* Complete Profile */}
    <Route
      path={ROUTES.COMPLETE_PROFILE}
      element={
        <RequireAuth>
          <RequireProfileIncomplete>
            <P.CompleteProfilePage />
          </RequireProfileIncomplete>
        </RequireAuth>
      }
    />

    {/* Confirm Location */}
    <Route
      path={ROUTES.CONFIRM_LOCATION}
      element={
        <RequireAuth>
          <P.ConfirmLocationPage />
        </RequireAuth>
      }
    />
  </Route>
);
