import { Route } from "react-router-dom";
import { ROUTES } from "../constants";

/* Layouts */
import PublicLayout from "../layouts/PublicLayout";

/* Guards */
import RedirectIfAuth from "../features/auth/guards/RedirectIfAuth";

/* Lazy Pages */
import { P } from "./lazyPages";

export const publicRoutes = () => {
  const routes = [
    {
      path: "/",
      element: (
        <RedirectIfAuth>
          <P.PublicRequestsPage />
        </RedirectIfAuth>
      ),
    },

    // Public Requests list
    {
      path: ROUTES.PUBLIC_REQUESTS,
      element: (
        <RedirectIfAuth>
          <P.PublicRequestsPage />
        </RedirectIfAuth>
      ),
    },

    // Public Request details
    {
      path: `${ROUTES.PUBLIC_REQUESTS}/:id`,
      element: (
        <RedirectIfAuth>
          <P.PublicRequestDetailsPage />
        </RedirectIfAuth>
      ),
    },
  ];

  return (
    <Route element={<PublicLayout />}>
      {routes.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
    </Route>
  );
};
