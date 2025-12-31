import { Route } from "react-router-dom";
import { ROUTES } from "../constants";

/* Layouts */
import PublicLayout from "../layouts/PublicLayout";

/* Guards */
import RedirectAuthedToAppRequests from "../features/auth/guards/RedirectAuthedToAppRequests";

/* Lazy Pages */
import { P } from "./lazyPages";

export const publicRoutes = () => {
  const routes = [
    { path: ROUTES.PUBLIC_REQUESTS, element: <P.PublicRequestsPage /> },
    {
      path: `${ROUTES.PUBLIC_REQUESTS}/:id`,
      element: <P.PublicRequestDetailsPage />,
    },
  ];

  return (
    <Route
      element={
        <RedirectAuthedToAppRequests>
          <PublicLayout />
        </RedirectAuthedToAppRequests>
      }
    >
      {routes.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
    </Route>
  );
};
